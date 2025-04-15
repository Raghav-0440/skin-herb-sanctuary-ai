import axios from 'axios';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const GEMINI_API_KEY = 'AIzaSyCvv23wQyQwtt0ywmcXtwpddSz_m0vGcAM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const ALLOWED_PLANTS = [
  "Sacred Fig", "Mexican Poppy", "Indian Madder", "Mango Ginger", 
  "Black Nightshade", "Comfrey", "Indigo", "Oregon Grape", 
  "Hemp Seed Oil", "Nettles", "Holy Basil", "Echinacea", 
  "Gotu Kola", "Calendula", "Aloe Vera", "Turmeric", 
  "Neem", "Sandalwood", "Saffron"
];

const ALLOWED_REMEDIES = [
  "Rose Water and Aloe Vera Mask", "Cucumber and Mint Face Mask", 
  "Neem and Turmeric Face Pack", "Green Tea and Honey Mask", 
  "Turmeric and Milk Face Pack", "Honey Aloe Face Mask", 
  "Rice Water Toner", "Papaya and Honey Face Pack", 
  "Aloe Vera Gel with Rose Water", "Coconut Lemon Body Scrub", 
  "Oatmeal and Honey Face Mask", "Cucumber Face Mask", 
  "Besan Body Scrub", "Saffron and Honey Face Pack", 
  "Turmeric and Gram Flour Face Pack"
];

const systemPrompt = `You are an expert herbal skincare assistant. Follow these rules STRICTLY:

1. PLANT/REMEDY USAGE:
   - ONLY use from these approved lists:
     Plants: ${ALLOWED_PLANTS.join(', ')}
     Remedies: ${ALLOWED_REMEDIES.join(', ')}
   - NEVER suggest anything outside these lists

2. RESPONSE BEHAVIOR:
   - Maintain full conversation context
   - If something didn't work, suggest alternatives
   - Address all concerns in complex queries
   - Never repeat ineffective suggestions

3. RESPONSE FORMAT:
   [Skin Concern]
   • [Detailed description of concern]
   
   [Recommended Plants]
   • [Plant 1] - [Specific benefit for this case]
   • [Plant 2] - [Specific benefit for this case]
   
   [Suggested Remedies]
   • [Remedy 1] - [Specific instructions for this case]
   • [Remedy 2] - [Specific instructions for this case]`;

export async function generateResponse(query: string, chatHistory: Message[] = []): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('API key is not configured');
    }

    // Gemini API doesn't support 'system' role directly
    // We need to format the conversation properly
    const formattedMessages = [];
    
    // Add system prompt as the first user message
    formattedMessages.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    
    // Add a placeholder model response to acknowledge the system prompt
    formattedMessages.push({
      role: 'model',
      parts: [{ text: 'I understand. I will act as an expert herbal skincare assistant following those guidelines.' }]
    });
    
    // Add the conversation history
    for (const msg of chatHistory) {
      formattedMessages.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
    
    // Add the current user query
    formattedMessages.push({
      role: 'user',
      parts: [{ text: query }]
    });
    
    console.log('Sending to Gemini API:', JSON.stringify(formattedMessages, null, 2));
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: formattedMessages
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('Received response from Gemini API');

    if (!response.data) {
      throw new Error('Empty response from API');
    }

    const responseData = response.data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    
    if (!responseData.candidates || responseData.candidates.length === 0) {
      throw new Error('No response candidates returned from API');
    }
    
    const candidate = responseData.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Invalid response format: missing content or parts');
    }
    
    const text = candidate.content.parts[0].text;
    if (!text) {
      throw new Error('Invalid response format: empty text in response');
    }
    
    console.log('Successfully received valid response from Gemini');
    return text;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error && 'isAxiosError' in error) {
      // Create a type-safe reference to the Axios error
      const axiosError = error as unknown as {
        response?: {
          status?: number;
          statusText?: string;
          data?: any;
        };
        config?: {
          url?: string;
          method?: string;
          timeout?: number;
          headers?: Record<string, string>;
        };
        message: string;
      };

      const errorDetails = {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          timeout: axiosError.config?.timeout,
          headers: axiosError.config?.headers
        }
      };
      console.error('API Error Details:', JSON.stringify(errorDetails, null, 2));
      
      let errorMessage = `API request failed (${axiosError.response?.status || 'No status'}): ${axiosError.message}`;
      
      // Handle Gemini API specific error structure
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data;
        
        // Check for error in Gemini API format
        if (responseData.error) {
          const apiError = responseData.error;
          if (typeof apiError === 'object') {
            if (apiError.message) {
              errorMessage += `\nServer message: ${apiError.message}`;
            }
            if (apiError.status) {
              errorMessage += `\nStatus: ${apiError.status}`;
            }
            if (apiError.details && Array.isArray(apiError.details) && apiError.details.length > 0) {
              errorMessage += `\nDetails: ${JSON.stringify(apiError.details)}`;
            }
          } else if (typeof apiError === 'string') {
            errorMessage += `\nServer message: ${apiError}`;
          }
        }
      }
      throw new Error(errorMessage);
    }
    throw new Error(`Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}