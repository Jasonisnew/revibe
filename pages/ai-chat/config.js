// AI Chat Configuration
const AI_CHAT_CONFIG = {
    // OpenAI API Configuration
    OPENAI_API_KEY: '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', 
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    
    // Model Configuration
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 300,
    TEMPERATURE: 0.7,
    TOP_P: 1,
    FREQUENCY_PENALTY: 0,
    PRESENCE_PENALTY: 0,
    
    // System Prompt
    SYSTEM_PROMPT: `You are a helpful AI assistant specializing in fitness and rehabilitation. You provide guidance on exercises, recovery techniques, and general fitness advice. Always prioritize safety and recommend consulting healthcare professionals when appropriate. Keep responses concise, encouraging, and practical.`,
    
    // UI Configuration
    TYPING_DELAY: 1000, // Minimum delay to show typing indicator
    MAX_CONVERSATION_LENGTH: 50, // Maximum number of messages to keep in history
    
    // Error Messages
    ERROR_MESSAGES: {
        API_KEY_MISSING: '⚠️ Please configure your OpenAI API key to use the AI chat feature.',
        API_ERROR: 'Sorry, I encountered an error. Please try again.',
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        RATE_LIMIT: 'Rate limit exceeded. Please wait a moment and try again.'
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CHAT_CONFIG;
} else {
    window.AI_CHAT_CONFIG = AI_CHAT_CONFIG;
} 