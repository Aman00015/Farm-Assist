# Gemini AI Setup Instructions

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Setting Up the API Key

### Option 1: Environment Variable (Recommended)
1. Create a `.env` file in the root directory
2. Add the following line:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Restart the development server

### Option 2: Configure in the App
1. Start the application
2. Navigate to the Chatbot page
3. Click "Configure AI Assistant" button
4. Enter your API key in the modal
5. Click "Configure"

## Features

- **Multi-language Support**: The chatbot responds in the selected language (English, Hindi, Telugu)
- **Voice Input**: Use the microphone button to ask questions via voice
- **Smart Responses**: AI-powered responses based on Gemini Pro model
- **Fallback Mode**: Works with hardcoded responses if API key is not configured

## Troubleshooting

- If you see "API key not configured" errors, make sure your API key is correctly set
- The API key should start with "AIza" and be about 39 characters long
- Make sure you have enabled the Gemini API in your Google Cloud Console