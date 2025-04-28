import os
import sys
import time
import json
import queue
import threading
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
import logging
from pathlib import Path
import cgi
import uuid
import tempfile
import traceback

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("ml_service.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("MLService")

# Create a queue for processing requests
request_queue = queue.Queue()
result_queue = queue.Queue()

# Global dictionary to store results by request ID
results = {}

# Define your classes
class_names = ['Acne', 'Carcinoma', 'Eczema', 'Keratosis', 'Milia', 'Rosacea']

# Global model variable
model = None

def load_trained_model():
    """Load the trained model"""
    global model
    try:
        if model is not None:
            return model
            
        model_path = os.path.join(os.path.dirname(__file__), '..', 'Model', 'skin_conditions_model.h5')
        logger.info(f"Loading model from: {model_path}")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
            
        # Log model file size
        model_size = os.path.getsize(model_path) / (1024 * 1024)  # Size in MB
        logger.info(f"Model file size: {model_size:.2f} MB")
        
        # Try loading with basic settings first
        try:
            model = tf.keras.models.load_model(model_path, compile=False)
        except Exception as e:
            logger.warning(f"Basic loading failed: {str(e)}")
            # If basic loading fails, try with minimal custom objects
            model = tf.keras.models.load_model(
                model_path,
                compile=False,
                custom_objects={
                    'tf': tf,
                    'InputLayer': tf.keras.layers.InputLayer,
                    'Model': tf.keras.Model,
                    'Sequential': tf.keras.Sequential
                }
            )
        
        logger.info("Model loaded successfully")
        
        # Validate model weights
        weights = model.get_weights()
        logger.info(f"Model weights shape: {[w.shape for w in weights]}")
        
        # Test model with random input
        logger.info("\nTesting model with random input...")
        test_input = np.random.random((1, 224, 224, 3))
        test_pred = model.predict(test_input, verbose=0)
        logger.info(f"Test prediction shape: {test_pred.shape}")
        logger.info(f"Test prediction sum: {np.sum(test_pred)}")  # Should be close to 1.0
        
        # Log predictions for each class
        logger.info("\nTest predictions for each class:")
        for class_name, prob in zip(class_names, test_pred[0]):
            logger.info(f"{class_name}: {prob:.4f}")
        
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        raise

def preprocess_image(img_path):
    """Preprocess image for model input"""
    try:
        # Load image
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        
        # Normalize to [0,1]
        img_array = img_array / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

def process_image(image_path, request_id):
    """Process an image and return predictions"""
    try:
        logger.info(f"Processing image: {image_path}")
        logger.info(f"Request ID: {request_id}")
        
        # Preprocess image
        img_array = preprocess_image(image_path)
        
        # Log image details
        logger.info(f"Image shape: {img_array.shape}")
        logger.info(f"Image value range: [{img_array.min():.2f}, {img_array.max():.2f}]")
        
        # Load model (will use cached version if already loaded)
        model = load_trained_model()
        
        # Make prediction
        logger.info("Making prediction...")
        predictions = model.predict(img_array, verbose=1)
        
        # Log raw predictions
        logger.info("\nRaw predictions:")
        for class_name, prob in zip(class_names, predictions[0]):
            logger.info(f"{class_name}: {prob:.4f}")
        
        # Get top 3 predictions
        top3_idx = np.argsort(predictions[0])[-3:][::-1]
        top3_predictions = [(class_names[i], predictions[0][i]) for i in top3_idx]
        
        logger.info("\nTop 3 predictions:")
        for class_name, prob in top3_predictions:
            logger.info(f"{class_name}: {prob:.4f}")
        
        # Get final prediction
        predicted_class = class_names[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])
        
        logger.info(f"\nFinal prediction: {predicted_class}")
        logger.info(f"Confidence: {confidence:.4f}")
        
        # Validate predictions
        if confidence < 0.5:  # If confidence is too low
            logger.warning("Low confidence prediction. Checking model weights...")
            # Check if model weights are loaded correctly
            weights = model.get_weights()
            logger.info(f"Model weights shape: {[w.shape for w in weights]}")
            
            # Test with a known image if available
            test_image_path = os.path.join(os.path.dirname(__file__), '..', 'test_images', 'test.jpg')
            if os.path.exists(test_image_path):
                logger.info("Testing with known image...")
                test_img = preprocess_image(test_image_path)
                test_pred = model.predict(test_img, verbose=1)
                logger.info("Test image predictions:")
                for class_name, prob in zip(class_names, test_pred[0]):
                    logger.info(f"{class_name}: {prob:.4f}")
        
        # Store results
        result = {
            'request_id': request_id,
            'predicted_class': predicted_class,
            'confidence': float(confidence),
            'top3_predictions': [
                {'class': class_name, 'probability': float(prob)}
                for class_name, prob in top3_predictions
            ],
            'all_predictions': {
                class_name: float(prob)
                for class_name, prob in zip(class_names, predictions[0])
            }
        }
        
        # Store in global dictionary
        results[request_id] = result
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        raise

def get_recommendations(skin_condition):
    """Get recommendations based on the skin condition"""
    # This is a simple mapping - you can expand this with more detailed recommendations
    recommendations = {
        'Acne': {
            'plants': [
                {'plant': 'Tea Tree', 'benefit': 'Natural antiseptic properties help reduce inflammation and bacteria'},
                {'plant': 'Aloe Vera', 'benefit': 'Soothes inflammation and promotes healing'},
                {'plant': 'Neem', 'benefit': 'Antibacterial and anti-inflammatory properties'}
            ],
            'homeRemedies': [
                {'remedy': 'Honey Mask', 'benefit': 'Natural antibacterial properties help fight acne'},
                {'remedy': 'Green Tea Compress', 'benefit': 'Reduces inflammation and soothes skin'},
                {'remedy': 'Apple Cider Vinegar', 'benefit': 'Helps balance skin pH and reduce bacteria'}
            ]
        },
        'Eczema': {
            'plants': [
                {'plant': 'Chamomile', 'benefit': 'Calming properties help reduce inflammation'},
                {'plant': 'Oatmeal', 'benefit': 'Soothes itching and irritation'},
                {'plant': 'Calendula', 'benefit': 'Anti-inflammatory and healing properties'}
            ],
            'homeRemedies': [
                {'remedy': 'Coconut Oil', 'benefit': 'Natural moisturizer with anti-inflammatory properties'},
                {'remedy': 'Oatmeal Bath', 'benefit': 'Soothes itching and irritation'},
                {'remedy': 'Aloe Vera Gel', 'benefit': 'Cooling and healing properties'}
            ]
        },
        'Rosacea': {
            'plants': [
                {'plant': 'Green Tea', 'benefit': 'Anti-inflammatory properties help reduce redness'},
                {'plant': 'Chamomile', 'benefit': 'Calming properties help reduce inflammation'},
                {'plant': 'Licorice Root', 'benefit': 'Helps reduce redness and inflammation'}
            ],
            'homeRemedies': [
                {'remedy': 'Green Tea Compress', 'benefit': 'Reduces inflammation and redness'},
                {'remedy': 'Honey Mask', 'benefit': 'Natural anti-inflammatory properties'},
                {'remedy': 'Aloe Vera Gel', 'benefit': 'Cooling and soothing properties'}
            ]
        },
        'Keratosis': {
            'plants': [
                {'plant': 'Tea Tree Oil', 'benefit': 'Natural exfoliating properties'},
                {'plant': 'Apple Cider Vinegar', 'benefit': 'Helps soften and remove keratosis'},
                {'plant': 'Aloe Vera', 'benefit': 'Promotes skin healing and regeneration'}
            ],
            'homeRemedies': [
                {'remedy': 'Apple Cider Vinegar', 'benefit': 'Natural exfoliant that helps remove keratosis'},
                {'remedy': 'Coconut Oil', 'benefit': 'Moisturizes and softens skin'},
                {'remedy': 'Salicylic Acid', 'benefit': 'Helps remove keratosis gently'}
            ]
        },
        'Milia': {
            'plants': [
                {'plant': 'Tea Tree Oil', 'benefit': 'Natural astringent properties'},
                {'plant': 'Witch Hazel', 'benefit': 'Helps tighten pores and reduce milia'},
                {'plant': 'Aloe Vera', 'benefit': 'Promotes skin healing'}
            ],
            'homeRemedies': [
                {'remedy': 'Steam Treatment', 'benefit': 'Opens pores and helps remove milia'},
                {'remedy': 'Honey Mask', 'benefit': 'Natural exfoliant and antibacterial properties'},
                {'remedy': 'Retinol', 'benefit': 'Promotes skin cell turnover'}
            ]
        },
        'Carcinoma': {
            'plants': [
                {'plant': 'Green Tea', 'benefit': 'Antioxidant properties may help protect skin'},
                {'plant': 'Turmeric', 'benefit': 'Anti-inflammatory properties'},
                {'plant': 'Aloe Vera', 'benefit': 'Promotes skin healing'}
            ],
            'homeRemedies': [
                {'remedy': 'Regular Skin Checks', 'benefit': 'Early detection is crucial'},
                {'remedy': 'Sun Protection', 'benefit': 'Use SPF and protective clothing'},
                {'remedy': 'Consult Dermatologist', 'benefit': 'Professional medical advice is essential'}
            ]
        }
    }
    
    return recommendations.get(skin_condition, {
        'plants': [
            {'plant': 'Aloe Vera', 'benefit': 'General skin healing and soothing properties'},
            {'plant': 'Green Tea', 'benefit': 'Antioxidant properties for skin health'},
            {'plant': 'Chamomile', 'benefit': 'Calming and anti-inflammatory properties'}
        ],
        'homeRemedies': [
            {'remedy': 'Regular Moisturizing', 'benefit': 'Maintains skin health'},
            {'remedy': 'Sun Protection', 'benefit': 'Prevents skin damage'},
            {'remedy': 'Healthy Diet', 'benefit': 'Supports skin health from within'}
        ]
    })

def worker():
    """Worker thread that processes images from the queue"""
    while True:
        try:
            # Get a request from the queue
            request = request_queue.get()
            if request is None:
                break
                
            request_id, image_path = request
            logger.info(f"Processing request {request_id} with image {image_path}")
            
            # Process the image
            process_image(image_path, request_id)
            
            # Mark task as done
            request_queue.task_done()
        except Exception as e:
            logger.error(f"Error in worker thread: {e}")
            request_queue.task_done()

def get_result(request_id):
    """Get the result for a specific request ID"""
    if request_id in results:
        result = results[request_id]
        logger.info(f"Returning result for request {request_id}: {json.dumps(result, indent=2)}")
        return result
    logger.info(f"No result found for request {request_id}")
    return {'status': 'pending', 'request_id': request_id}

def add_to_queue(request_id, image_path):
    """Add a new request to the processing queue"""
    request_queue.put((request_id, image_path))
    logger.info(f"Added request {request_id} to queue")
    return {'status': 'queued', 'request_id': request_id}

# Start worker threads
num_workers = 2  # Adjust based on your system's capabilities
worker_threads = []
for _ in range(num_workers):
    t = threading.Thread(target=worker)
    t.daemon = True
    t.start()
    worker_threads.append(t)

logger.info(f"Started {num_workers} worker threads")

# Create a simple HTTP server to handle requests
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse

def save_uploaded_file(fileitem, upload_dir='uploads'):
    """Save uploaded file and return the path"""
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    # Generate unique filename
    file_name = str(uuid.uuid4()) + '.jpg'
    file_path = os.path.join(upload_dir, file_name)
    
    # Save the file
    with open(file_path, 'wb') as f:
        f.write(fileitem.file.read())
    
    return file_path

class MLServiceHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        """Send CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight"""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Handle GET requests to check status or get results"""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        logger.info(f"Received GET request for path: {path}")
        
        if path == '/health':
            self.send_response(200)
            self._send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'healthy'}).encode())
            return
            
        if path.startswith('/api/analysis-result/'):
            request_id = path.split('/')[-1]
            logger.info(f"Getting result for request ID: {request_id}")
            result = get_result(request_id)
            logger.info(f"Sending response: {json.dumps(result, indent=2)}")
            self.send_response(200)
            self._send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            return
            
        logger.warning(f"Path not found: {path}")
        self.send_response(404)
        self.end_headers()
        
    def do_POST(self):
        """Handle POST requests to submit new images for processing"""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/analyze-skin':
            try:
                # Parse multipart form data
                content_type = self.headers.get('Content-Type', '')
                if not content_type.startswith('multipart/form-data'):
                    raise ValueError('Expected multipart/form-data')
                
                # Parse the form data
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST',
                            'CONTENT_TYPE': self.headers['Content-Type']}
                )
                
                # Check if image file was uploaded
                if 'image' not in form:
                    raise ValueError('No image file uploaded')
                
                fileitem = form['image']
                if not fileitem.file:
                    raise ValueError('No image file uploaded')
                
                # Save the uploaded file
                image_path = save_uploaded_file(fileitem)
                
                # Generate request ID
                request_id = str(uuid.uuid4())
                
                # Directly process the image and get the result
                result = process_image(image_path, request_id)
                
                # Return the result to the frontend
                self.send_response(200)
                self._send_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'success',
                    'request_id': request_id,
                    'result': result
                }).encode())
                
            except Exception as e:
                logger.error(f"Error processing upload: {str(e)}")
                self.send_response(500)
                self._send_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'error',
                    'error': str(e)
                }).encode())
            return
            
        self.send_response(404)
        self.end_headers()

def run_server(port=3001):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, MLServiceHandler)
    logger.info(f"Starting ML service on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    # Start the server in a separate thread
    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down ML service")
        # Signal worker threads to exit
        for _ in range(num_workers):
            request_queue.put(None)
        # Wait for worker threads to finish
        for t in worker_threads:
            t.join() 