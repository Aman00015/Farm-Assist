import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // Initialize with your API key - you'll need to provide this
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.modelName = "gemini-2.5-flash";
    this.model = null;
    this.initializeModel();
  }

  initializeModel() {
    if (this.apiKey && this.apiKey !== 'YOUR_API_KEY_HERE') {
      try {
        this.model = this.genAI.getGenerativeModel({ model: this.modelName });
      } catch (error) {
        console.error('Error initializing model:', error);
      }
    }
  }

  async generateResponse(userMessage, language = 'en') {
    try {
      if (!this.isConfigured()) {
        throw new Error('Gemini API key not configured');
      }

      // Reinitialize model if not already set
      if (!this.model) {
        this.initializeModel();
      }

      console.log('Using API key:', this.apiKey.substring(0, 10) + '...');
      console.log('Using model:', this.modelName);

      const languageInstructions = {
        'en': 'Respond in English. Be helpful and provide practical farming advice.',
        'hi': 'Respond in Hindi (हिंदी). Be helpful and provide practical farming advice in Hindi.',
        'te': 'Respond in Telugu (తెలుగు). Be helpful and provide practical farming advice in Telugu.'
      };

      const prompt = `${languageInstructions[language] || languageInstructions['en']}

You are an expert agricultural assistant helping farmers with their queries. Provide accurate, practical, and helpful advice about:

- Crop cultivation and farming techniques
- Soil management and fertility
- Pest and disease control
- Irrigation and water management
- Government schemes and subsidies
- Weather-related farming advice
- Organic farming methods
- Crop yield optimization
- Market information and pricing

User's question: ${userMessage}

Please provide a detailed, helpful response that a farmer can easily understand and implement.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      
      // More detailed error handling
      if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
        console.error('Invalid API key. Please check your Gemini API key.');
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        console.error('Model not found. Please check the model name.');
      }
      
      // Fallback responses based on language
      const fallbackResponses = {
        'en': 'I apologize, but I\'m currently unable to process your request. Please check your API key configuration and try again later.',
        'hi': 'मुझे खेद है, लेकिन मैं वर्तमान में आपके अनुरोध को संसाधित करने में असमर्थ हूं। कृपया अपनी API key की जाँच करें और बाद में पुनः प्रयास करें।',
        'te': 'క్షమించండి, కానీ నేను ప్రస్తుతం మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోతున్నాను. దయచేసి మీ API keyని తనిఖీ చేసి, తర్వాత మళ్లీ ప్రయత్నించండి.'
      };
      
      return fallbackResponses[language] || fallbackResponses['en'];
    }
  }

  // Method to check if API key is configured
  isConfigured() {
    return this.apiKey && this.apiKey !== 'YOUR_API_KEY_HERE';
  }

  // Updated method to list available models (using the correct approach)
  async listModels() {
    try {
      if (!this.isConfigured()) {
        console.log('API key not configured - skipping model listing');
        return null;
      }

      // Note: The current SDK version doesn't have a direct listModels method
      // You would need to use the REST API directly for this functionality
      console.log('Model listing requires direct REST API call in current SDK version');
      console.log('Using model:', this.modelName);
      
      // Return basic model info since direct listing isn't available
      return {
        models: [{
          name: this.modelName,
          version: 'v1',
          displayName: 'Gemini Pro',
          supportedGenerationMethods: ['generateContent']
        }]
      };
    } catch (error) {
      console.error('Error in model listing:', error);
      return null;
    }
  }

  // Method to set API key (for configuration)
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.initializeModel();
  }

  // Method to validate API key by making a test call
  async validateApiKey() {
    try {
      if (!this.isConfigured()) {
        return { valid: false, error: 'API key not configured' };
      }

      const testModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await testModel.generateContent('Test');
      await result.response;
      
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Export a singleton instance
export default new GeminiService();