import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minimize2, Maximize2, Star } from 'lucide-react';
import { Message, ChatHistory, generateResponse, getSkinAssessment, getEducationalContent, SkinAssessment, FeedbackData, processFeedback, SkincareQuery, handleSkincareQuery } from '@/services/mistralService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [
      {
        role: 'assistant',
        content: 'Hello! I\'m your herbal skincare assistant. How can I help you today? You can:\n1. Get a skin consultation\n2. Learn about herbal ingredients\n3. Get skincare tips\n4. Ask about specific plants\n5. Learn about traditional remedies'
      }
    ]
  });
  
  const [assessmentState, setAssessmentState] = useState<{
    isActive: boolean;
    currentQuestion: number;
    answers: Record<string, string>;
  }>({
    isActive: false,
    currentQuestion: 0,
    answers: {}
  });

  const [feedbackState, setFeedbackState] = useState<{
    isActive: boolean;
    type: 'complaint' | 'review' | 'return' | 'general' | null;
    step: number;
    data: Partial<FeedbackData>;
  }>({
    isActive: false,
    type: null,
    step: 0,
    data: {}
  });

  const skinAssessmentQuestions = [
    {
      id: 'oily',
      question: 'Does your skin feel oily, especially in the T-zone (forehead, nose, and chin)?',
      options: ['yes', 'no']
    },
    {
      id: 'dry',
      question: 'Does your skin feel dry or tight after cleansing?',
      options: ['yes', 'no']
    },
    {
      id: 'acne',
      question: 'Do you experience breakouts or acne?',
      options: ['yes', 'no']
    },
    {
      id: 'aging',
      question: 'Are you concerned about fine lines, wrinkles, or aging?',
      options: ['yes', 'no']
    },
    {
      id: 'hyperpigmentation',
      question: 'Do you have dark spots or uneven skin tone?',
      options: ['yes', 'no']
    },
    {
      id: 'sensitivity',
      question: 'Does your skin react easily to new products?',
      options: ['yes', 'no']
    },
    {
      id: 'reactions',
      question: 'How often does your skin react to products?',
      options: ['never', 'sometimes', 'often']
    }
  ];

  const feedbackSteps = {
    complaint: [
      {
        question: 'Please describe your complaint in detail.',
        field: 'content'
      },
      {
        question: 'Please provide your email address so we can follow up with you.',
        field: 'userEmail'
      }
    ],
    review: [
      {
        question: 'Which product would you like to review?',
        field: 'productId'
      },
      {
        question: 'How would you rate your experience? (1-5 stars)',
        field: 'rating',
        type: 'rating'
      },
      {
        question: 'Please share your detailed review.',
        field: 'content'
      }
    ],
    return: [
      {
        question: 'Which product would you like to return?',
        field: 'productId'
      },
      {
        question: 'Please explain the reason for your return.',
        field: 'content'
      },
      {
        question: 'Please provide your email address for return instructions.',
        field: 'userEmail'
      }
    ],
    general: [
      {
        question: 'Please share your feedback with us.',
        field: 'content'
      }
    ]
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.messages]);

  const handleAssessmentAnswer = (answer: string) => {
    const { currentQuestion, answers } = assessmentState;
    const question = skinAssessmentQuestions[currentQuestion];
    
    const newAnswers = { ...answers, [question.id]: answer };
    
    if (currentQuestion < skinAssessmentQuestions.length - 1) {
      // Move to next question
      setAssessmentState({
        isActive: true,
        currentQuestion: currentQuestion + 1,
        answers: newAnswers
      });
      
      const nextQuestion = skinAssessmentQuestions[currentQuestion + 1];
      addMessage('assistant', nextQuestion.question);
    } else {
      // Complete assessment
      const assessment = getSkinAssessment(newAnswers);
      setAssessmentState({
        isActive: false,
        currentQuestion: 0,
        answers: {}
      });
      
      // Add assessment results to chat
      addMessage('assistant', formatAssessmentResults(assessment));
    }
  };

  const formatAssessmentResults = (assessment: SkinAssessment): string => {
    return `Based on your assessment, here are your results:

Skin Type: ${assessment.skinType}
Concerns: ${assessment.concerns.join(', ')}
Sensitivity Level: ${assessment.sensitivity}

${assessment.routine}

Recommended Herbs:
${assessment.recommendations.map(rec => `- ${rec}`).join('\n')}

Would you like to learn more about any of these recommendations or get additional skincare advice?`;
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setChatHistory(prev => ({
      messages: [...prev.messages, { role, content }]
    }));
  };

  const handleFeedbackStart = (type: 'complaint' | 'review' | 'return' | 'general') => {
    setFeedbackState({
      isActive: true,
      type,
      step: 0,
      data: { type, status: 'pending' }
    });
    
    const firstQuestion = feedbackSteps[type][0].question;
    addMessage('assistant', firstQuestion);
  };

  const handleFeedbackInput = (input: string) => {
    const { type, step, data } = feedbackState;
    if (!type) return;

    const currentStep = feedbackSteps[type][step];
    const newData = { ...data, [currentStep.field]: input };

    if (step < feedbackSteps[type].length - 1) {
      // Move to next question
      setFeedbackState({
        isActive: true,
        type,
        step: step + 1,
        data: newData
      });
      
      const nextQuestion = feedbackSteps[type][step + 1].question;
      addMessage('assistant', nextQuestion);
    } else {
      // Complete feedback
      const feedback: FeedbackData = {
        ...newData as FeedbackData,
        status: 'pending'
      };
      
      const response = processFeedback(feedback);
      setFeedbackState({
        isActive: false,
        type: null,
        step: 0,
        data: {}
      });
      
      addMessage('assistant', response);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addMessage('user', userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // Check for feedback-related keywords
      if (userMessage.toLowerCase().includes('complaint') || 
          userMessage.toLowerCase().includes('issue') ||
          userMessage.toLowerCase().includes('problem')) {
        handleFeedbackStart('complaint');
        setIsLoading(false);
        return;
      }

      if (userMessage.toLowerCase().includes('review') || 
          userMessage.toLowerCase().includes('rating')) {
        handleFeedbackStart('review');
        setIsLoading(false);
        return;
      }

      if (userMessage.toLowerCase().includes('return') || 
          userMessage.toLowerCase().includes('refund')) {
        handleFeedbackStart('return');
        setIsLoading(false);
        return;
      }

      if (userMessage.toLowerCase().includes('feedback') || 
          userMessage.toLowerCase().includes('suggestion')) {
        handleFeedbackStart('general');
        setIsLoading(false);
        return;
      }

      // Check for skin consultation
      if (userMessage.toLowerCase().includes('skin consultation') || 
          userMessage.toLowerCase().includes('skin assessment')) {
        setAssessmentState({
          isActive: true,
          currentQuestion: 0,
          answers: {}
        });
        addMessage('assistant', skinAssessmentQuestions[0].question);
        setIsLoading(false);
        return;
      }

      // Check for educational content
      const educationalTopics = ['herbal ingredients', 'natural skincare', 'skin health', 'traditional remedies'];
      for (const topic of educationalTopics) {
        if (userMessage.toLowerCase().includes(topic)) {
          const content = getEducationalContent(topic.replace(' ', '_'));
          addMessage('assistant', content);
          setIsLoading(false);
          return;
        }
      }

      // Handle feedback input if in feedback mode
      if (feedbackState.isActive) {
        handleFeedbackInput(userMessage);
        setIsLoading(false);
        return;
      }

      // For all other queries, use the AI response generator
      const response = await generateResponse(userMessage, chatHistory);
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error getting response:', error);
      addMessage('assistant', 'I apologize, but I encountered an error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-herb text-white rounded-full p-3 shadow-lg hover:bg-herb-dark transition-colors"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className={`bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isMinimized ? 'w-64 h-12' : 'w-96 h-[500px]'}`}>
          <div className="bg-[#222] p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-herb flex items-center justify-center">
                <MessageSquare size={16} className="text-white" />
              </div>
              <h3 className="text-white font-medium">Herbal Assistant</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="p-4 h-[380px] overflow-y-auto">
                {chatHistory.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-herb text-white'
                          : 'bg-[#333] text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-lg max-w-[80%] bg-[#333] text-white">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                {assessmentState.isActive && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-lg max-w-[80%] bg-[#333] text-white">
                      <div className="flex flex-col gap-2">
                        {skinAssessmentQuestions[assessmentState.currentQuestion].options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAssessmentAnswer(option)}
                            className="bg-herb text-white px-4 py-2 rounded hover:bg-herb-dark transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {feedbackState.isActive && feedbackState.type === 'review' && 
                 feedbackSteps[feedbackState.type][feedbackState.step].type === 'rating' && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-lg max-w-[80%] bg-[#333] text-white">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleFeedbackInput(rating.toString())}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            <Star size={24} fill={rating <= (feedbackState.data.rating || 0) ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-[#333]">
                <div className="flex gap-2">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#333] text-white rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-herb"
                    rows={1}
                    disabled={assessmentState.isActive || feedbackState.isActive}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !userInput.trim() || assessmentState.isActive || feedbackState.isActive}
                    className="bg-herb text-white rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-herb-dark transition-colors"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot; 