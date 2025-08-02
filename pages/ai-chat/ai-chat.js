// AI Chat page specific JavaScript

// DOM elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Chat state
let isTyping = false;
let conversationHistory = [];

// Get configuration
const config = window.AI_CHAT_CONFIG || {
    OPENAI_API_KEY: 'your-openai-api-key-here',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 300,
    TEMPERATURE: 0.7,
    SYSTEM_PROMPT: 'You are a helpful AI assistant specializing in fitness and rehabilitation.',
    ERROR_MESSAGES: {
        API_KEY_MISSING: '⚠️ Please configure your OpenAI API key to use the AI chat feature.',
        API_ERROR: 'Sorry, I encountered an error. Please try again.'
    }
};

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;

    // Add user message to chat
    addMessage(message, 'user');
    
    // Add to conversation history
    conversationHistory.push({ role: 'user', content: message });
    
    // Clear input
    messageInput.value = '';
    updateSendButton();
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response from OpenAI
        const aiResponse = await getAIResponse(message);
        hideTypingIndicator();
        addMessage(aiResponse, 'ai');
        
        // Add AI response to conversation history
        conversationHistory.push({ role: 'assistant', content: aiResponse });
        
        // Limit conversation history length
        if (conversationHistory.length > config.MAX_CONVERSATION_LENGTH) {
            conversationHistory = conversationHistory.slice(-config.MAX_CONVERSATION_LENGTH);
        }
    } catch (error) {
        hideTypingIndicator();
        console.error('Error getting AI response:', error);
        addMessage(config.ERROR_MESSAGES.API_ERROR, 'ai');
    }
}

// Get AI response from OpenAI API
async function getAIResponse(userMessage) {
    if (!config.OPENAI_API_KEY || config.OPENAI_API_KEY === 'your-openai-api-key-here') {
        throw new Error('OpenAI API key not configured');
    }

    const messages = [
        { role: 'system', content: config.SYSTEM_PROMPT },
        ...conversationHistory
    ];

    const requestBody = {
        model: config.MODEL,
        messages: messages,
        max_tokens: config.MAX_TOKENS,
        temperature: config.TEMPERATURE,
        top_p: config.TOP_P,
        frequency_penalty: config.FREQUENCY_PENALTY,
        presence_penalty: config.PRESENCE_PENALTY
    };

    const response = await fetch(config.OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText;
        
        if (response.status === 429) {
            throw new Error('Rate limit exceeded');
        } else if (response.status === 401) {
            throw new Error('Invalid API key');
        } else {
            throw new Error(`API request failed: ${response.status} ${errorMessage}`);
        }
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    const icon = document.createElement('i');
    if (sender === 'user') {
        icon.className = 'fas fa-user';
    } else {
        icon.className = 'fas fa-robot';
    }
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    content.appendChild(messageText);
    content.appendChild(messageTime);
    
    if (sender === 'user') {
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator-message';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-robot';
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }
    
    content.appendChild(typingIndicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update send button state
function updateSendButton() {
    const message = messageInput.value.trim();
    sendButton.disabled = !message || isTyping;
}

// Clear conversation history
function clearConversation() {
    conversationHistory = [];
    chatMessages.innerHTML = '';
    
    // Add welcome message back
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message ai-message';
    welcomeMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-text">
                How can I help you today? I'm here to assist with your fitness and rehabilitation journey.
            </div>
            <div class="message-time">Just now</div>
        </div>
    `;
    chatMessages.appendChild(welcomeMessage);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Enter key press
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Input change
    messageInput.addEventListener('input', updateSendButton);
    
    // Set up placeholder
    messageInput.placeholder = 'Send Message Here...';
    
    // Initial button state
    updateSendButton();
    
    // Check if API key is configured
    if (!config.OPENAI_API_KEY || config.OPENAI_API_KEY === 'your-openai-api-key-here') {
        console.warn('OpenAI API key not configured. Please add your API key to use the AI chat feature.');
        // Optionally show a warning message to the user
        setTimeout(() => {
            addMessage(config.ERROR_MESSAGES.API_KEY_MISSING, 'ai');
        }, 1000);
    }
});

// Export functions for potential use
window.aiChatFunctions = {
    sendMessage,
    addMessage,
    clearConversation,
    getAIResponse
}; 