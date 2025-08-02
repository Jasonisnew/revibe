// AI Chat page specific JavaScript

// DOM elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Chat state
let isTyping = false;
let conversationHistory = [];

// Enhanced AI responses with context awareness
const aiResponses = {
    greeting: [
        "Hello! I'm here to help with your fitness and rehabilitation journey. How are you feeling today?",
        "Welcome back! I'm ready to assist you with your recovery. What would you like to work on?",
        "Hi there! I'm your AI fitness assistant. How can I help you today?"
    ],
    exercise: [
        "Great choice! For that exercise, I'd recommend starting with 3 sets of 10 reps. Remember to maintain proper form.",
        "That's an excellent exercise for your recovery. Let's focus on controlled movements and proper breathing.",
        "Perfect! This exercise will help strengthen those muscles. Start slowly and gradually increase intensity."
    ],
    pain: [
        "I understand you're experiencing discomfort. It's important to listen to your body. Consider taking a rest day or doing gentle stretching.",
        "Pain is your body's way of communicating. If it persists, please consult with your physical therapist.",
        "Let's modify the exercise to avoid aggravating the area. We can try a gentler variation."
    ],
    progress: [
        "That's fantastic progress! You're showing real dedication to your recovery. Keep up the great work!",
        "I'm impressed with your consistency! Your hard work is paying off. What's your next goal?",
        "Excellent! You're making steady improvements. Remember, recovery is a journey, not a race."
    ],
    motivation: [
        "You've got this! Every small step forward is progress. I believe in your ability to reach your goals.",
        "Remember why you started this journey. You're stronger than you think, and every day you're getting better.",
        "Stay focused on your goals! You're doing amazing work, and I'm here to support you every step of the way."
    ],
    general: [
        "I'm here to support your fitness journey. What specific area would you like to focus on today?",
        "That's a great question! Let me help you understand how to approach this safely and effectively.",
        "I appreciate you sharing that with me. Let's work together to find the best approach for your situation."
    ]
};

// Send message function
function sendMessage() {
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
    
    // Generate contextual AI response
    setTimeout(() => {
        hideTypingIndicator();
        const aiResponse = generateContextualResponse(message);
        addMessage(aiResponse, 'ai');
        conversationHistory.push({ role: 'ai', content: aiResponse });
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
}

// Generate contextual AI response
function generateContextualResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for specific keywords to provide contextual responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse('greeting');
    } else if (message.includes('exercise') || message.includes('workout') || message.includes('training')) {
        return getRandomResponse('exercise');
    } else if (message.includes('pain') || message.includes('hurt') || message.includes('sore')) {
        return getRandomResponse('pain');
    } else if (message.includes('progress') || message.includes('improve') || message.includes('better')) {
        return getRandomResponse('progress');
    } else if (message.includes('motivation') || message.includes('tired') || message.includes('hard')) {
        return getRandomResponse('motivation');
    } else {
        return getRandomResponse('general');
    }
}

// Get random response from category
function getRandomResponse(category) {
    const responses = aiResponses[category];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
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
    generateContextualResponse
}; 