// AI Chat page specific JavaScript

// DOM elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Chat state
let isTyping = false;
let conversationHistory = [];

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
        // Get AI response from ChatGPT API with minimum typing delay
        const startTime = Date.now();
        const aiResponse = await getChatGPTResponse(message);
        const elapsedTime = Date.now() - startTime;
        
        // Ensure minimum typing delay for better UX
        const minDelay = AI_CHAT_CONFIG.TYPING_DELAY;
        if (elapsedTime < minDelay) {
            await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
        }
        
        hideTypingIndicator();
        addMessage(aiResponse, 'ai');
        conversationHistory.push({ role: 'ai', content: aiResponse });
    } catch (error) {
        hideTypingIndicator();
        console.error('Error getting AI response:', error);
        const errorMessage = getErrorMessage(error);
        addMessage(errorMessage, 'ai');
        
        // If API key is missing, show helpful setup instructions
        if (error.message === 'API_KEY_MISSING') {
            setTimeout(() => {
                addMessage('To use the AI chat feature, please update your API key in the config.js file. You can get an API key from https://platform.openai.com/api-keys', 'ai');
            }, 2000);
        }
    }
}

// Get ChatGPT API response
async function getChatGPTResponse(userMessage) {
    // Check if API key is configured
    if (!AI_CHAT_CONFIG.OPENAI_API_KEY || AI_CHAT_CONFIG.OPENAI_API_KEY === 'your-api-key-here') {
        throw new Error('API_KEY_MISSING');
    }

    // Prepare conversation history for API
    const messages = [
        { role: 'system', content: AI_CHAT_CONFIG.SYSTEM_PROMPT }
    ];

    // Add recent conversation history (limit to prevent token overflow)
    const recentHistory = conversationHistory.slice(-AI_CHAT_CONFIG.MAX_CONVERSATION_LENGTH);
    messages.push(...recentHistory);

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(AI_CHAT_CONFIG.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CHAT_CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: AI_CHAT_CONFIG.MODEL,
                messages: messages,
                max_tokens: AI_CHAT_CONFIG.MAX_TOKENS,
                temperature: AI_CHAT_CONFIG.TEMPERATURE,
                top_p: AI_CHAT_CONFIG.TOP_P,
                frequency_penalty: AI_CHAT_CONFIG.FREQUENCY_PENALTY,
                presence_penalty: AI_CHAT_CONFIG.PRESENCE_PENALTY
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 401) {
                throw new Error('API_KEY_INVALID');
            } else if (response.status === 429) {
                throw new Error('RATE_LIMIT');
            } else if (response.status >= 500) {
                throw new Error('API_ERROR');
            } else {
                throw new Error('API_ERROR');
            }
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error('API_ERROR');
        }

    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('NETWORK_ERROR');
        } else if (error.name === 'AbortError') {
            throw new Error('NETWORK_ERROR');
        }
        throw error;
    }
}

// Get appropriate error message
function getErrorMessage(error) {
    const errorMessages = AI_CHAT_CONFIG.ERROR_MESSAGES;
    
    switch (error.message) {
        case 'API_KEY_MISSING':
            return errorMessages.API_KEY_MISSING;
        case 'API_KEY_INVALID':
            return '⚠️ Invalid API key. Please check your OpenAI API key configuration.';
        case 'RATE_LIMIT':
            return errorMessages.RATE_LIMIT;
        case 'NETWORK_ERROR':
            return errorMessages.NETWORK_ERROR;
        case 'API_ERROR':
        default:
            return errorMessages.API_ERROR;
    }
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
    
    // Update button appearance
    if (sendButton.disabled) {
        sendButton.style.opacity = '0.5';
        sendButton.style.cursor = 'not-allowed';
    } else {
        sendButton.style.opacity = '1';
        sendButton.style.cursor = 'pointer';
    }
}

// Load conversation history from localStorage
function loadConversationHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        try {
            conversationHistory = JSON.parse(savedHistory);
            // Restore messages to chat
            conversationHistory.forEach(msg => {
                addMessage(msg.content, msg.role);
            });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
}

// Save conversation history to localStorage
function saveConversationHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}

// Clear chat history
function clearChatHistory() {
    conversationHistory = [];
    localStorage.removeItem('chatHistory');
    chatMessages.innerHTML = '';
    
    // Add welcome message back
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message ai-message';
    welcomeMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-text" id="welcome-message">
                How can I help you today? I'm here to assist with your fitness and rehabilitation journey.
            </div>
            <div class="message-time">Just now</div>
        </div>
    `;
    chatMessages.appendChild(welcomeMessage);
}

// Clear conversation history
function clearConversation() {
    conversationHistory = [];
    localStorage.removeItem('chatHistory');
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
    // Load conversation history
    loadConversationHistory();
    
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
    
    // Focus on input
    messageInput.focus();
    
    // Save conversation history periodically
    setInterval(saveConversationHistory, 30000); // Save every 30 seconds
});

// Export functions for potential use
window.aiChatFunctions = {
    sendMessage,
    addMessage,
    clearChatHistory,
    clearConversation,
    getChatGPTResponse, // Expose the new function
    getErrorMessage // Expose the new function
}; 