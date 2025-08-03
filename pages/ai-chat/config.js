// AI Chat Configuration
const CONFIG = {
    // OpenAI API Configuration
    OPENAI_API_KEY: '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', // Add your OpenAI API key here
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    OPENAI_MODEL: 'gpt-3.5-turbo', // or 'gpt-4' for better responses
    
    // Chat Configuration
    MAX_MESSAGES: 50, // Maximum messages to keep in conversation
    TYPING_DELAY: 1000, // Delay before showing typing indicator (ms)
    
    // System prompt for the AI
    SYSTEM_PROMPT: `You are a helpful fitness and rehabilitation assistant. You help users with:
    - Exercise recommendations and form guidance
    - Rehabilitation exercises and recovery tips
    - Fitness planning and workout routines
    - Injury prevention and safety advice
    - General health and wellness questions
    
    Always provide safe, evidence-based advice and encourage users to consult healthcare professionals for medical concerns. Make the respond concise and to the point. Search on the internet and find a picture that fit the answer of the user's question. Make sure the pictures are shown directly in the response.`,
    
    // Error messages
    ERROR_MESSAGES: {
        NO_API_KEY: 'OpenAI APxxI key not configured. Please add your API key to config.js',
        API_ERROR: 'Sorry, I encountered an error. Please try again.',
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        RATE_LIMIT: 'Too many requests. Please wait a moment and try again.'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 