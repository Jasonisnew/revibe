// AI Chat page specific JavaScript

// DOM elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Chat state
let isTyping = false;

// Sample AI responses for demo purposes
const aiResponses = [
    "I understand you're working on your rehabilitation. Let me help you with some exercises that would be beneficial for your recovery.",
    "That's a great question! For your current condition, I'd recommend starting with gentle stretching exercises.",
    "Based on your progress, you're doing really well! Let's focus on building strength gradually.",
    "I can suggest some modifications to make that exercise easier or more challenging, depending on your comfort level.",
    "Remember to listen to your body and not push too hard. Recovery takes time and patience.",
    "That's a common concern during rehabilitation. Let me explain the proper technique for that movement.",
    "Great progress! You're ready to move to the next level of exercises.",
    "I'd recommend consulting with your physical therapist about that specific movement.",
    "Let's track your progress together. How are you feeling after today's session?",
    "I'm here to support your fitness journey every step of the way!"
];

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;

    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    updateSendButton();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response after a delay
    setTimeout(() => {
        hideTypingIndicator();
        const aiResponse = getRandomAIResponse();
        addMessage(aiResponse, 'ai');
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
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

// Get random AI response
function getRandomAIResponse() {
    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    return aiResponses[randomIndex];
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
});



// Export functions for potential use
window.aiChatFunctions = {
    sendMessage,
    addMessage
}; 