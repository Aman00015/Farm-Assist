import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Mic, MicOff, Settings, User, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/Card';
import Button from '../components/Button';
import geminiService from '../services/geminiService';

const ChatbotPage = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm your farming assistant. ${t('askQuestion')}`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [sendDisabled, setSendDisabled] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Check if Gemini is configured on component mount
  useEffect(() => {
    if (!geminiService.isConfigured()) {
      setShowApiKeyModal(true);
    } else {
      geminiService.listModels().then(models => {
        if (models) {
          console.log('Model info:', models);
        }
      });
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Disable send button for 30 seconds
    setSendDisabled(true);
    setTimeout(() => setSendDisabled(false), 30000);

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Use Gemini AI if configured, otherwise use fallback
      let botResponseText;
      if (geminiService.isConfigured()) {
        botResponseText = await geminiService.generateResponse(messageText, language);
      } else {
        botResponseText = getBotResponse(messageText);
      }

      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('rice') || lowerMessage.includes('चावल')) {
      return "Rice cultivation requires well-drained soil and consistent water supply. The best time to plant is during monsoon season. Would you like specific advice for your region?";
    }
    if (lowerMessage.includes('wheat') || lowerMessage.includes('गेहूं')) {
      return "Wheat grows best in cool, dry weather. Plant in November-December for optimal yield. Ensure proper soil preparation and seed treatment.";
    }
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('खाद')) {
      return "For organic farming, use compost and vermicompost. For chemical fertilizers, get your soil tested first. NPK ratio depends on crop and soil type.";
    }
    if (lowerMessage.includes('disease') || lowerMessage.includes('बीमारी')) {
      return "Common crop diseases include blight, rust, and viral infections. Use our Disease Detection feature to identify specific issues. Prevention is better than cure!";
    }
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम')) {
      return "Weather plays a crucial role in farming. Monitor local forecasts regularly. I can help you plan activities based on weather conditions.";
    }
    
    return "I'm here to help with all your farming questions! Ask me about crops, diseases, fertilizers, weather, or government schemes. You can also use voice input for easier communication.";
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      const languageMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN'
      };
      recognition.lang = languageMap[language] || 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const handleApiKeySubmit = async () => {
    if (apiKey.trim()) {
      geminiService.setApiKey(apiKey.trim());
      
      const validation = await geminiService.validateApiKey();
      if (validation.valid) {
        setShowApiKeyModal(false);
        setMessages([{
          id: 1,
          text: `Hello! I'm your AI farming assistant powered by Gemini. ${t('askQuestion')}`,
          sender: 'bot',
          timestamp: new Date()
        }]);
      } else {
        alert(`Invalid API key: ${validation.error}. Please check your API key.`);
      }
    }
  };

  // Format message text with proper line breaks
  const formatMessageText = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <Settings className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Configure Gemini AI
              </h3>
              <p className="text-gray-600 text-sm">
                Enter your Gemini API key to enable AI-powered responses. You can get your API key from Google AI Studio.
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowApiKeyModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleApiKeySubmit}
                  disabled={!apiKey.trim()}
                  className="flex-1"
                >
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('chatbot')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('getInstantAnswers')}
          </p>
          {!geminiService.isConfigured() && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeyModal(true)}
                className="text-xs"
              >
                <Settings className="h-4 w-4 mr-1" />
                Configure AI Assistant
              </Button>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <Card className="flex flex-col h-[500px] sm:h-[600px]">
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-green-100 order-2' : 'bg-blue-100'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-green-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {formatMessageText(message.text)}
                  </p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 text-gray-900 max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-sm text-gray-600 ml-2">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={t('askQuestion')}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows="1"
              />
              <Button
                onClick={handleVoiceInput}
                variant={isListening ? 'primary' : 'outline'}
                size="icon"
                className="flex-shrink-0 w-12 h-12"
                title="Voice input"
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || loading || sendDisabled}
                size="icon"
                className="flex-shrink-0 w-12 h-12"
                title="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center sm:text-left">
            {t('quickQuestions')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              t('howToIncreaseYield'),
              t('bestFertilizerForRice'),
              t('organicPestControl'),
              t('waterManagementTips'),
              t('soilTestingImportance'),
              t('governmentLoanSchemes')
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSendMessage(question)}
                className="text-left justify-start h-auto py-3 px-4 min-h-[60px] text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="line-clamp-2">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotPage;