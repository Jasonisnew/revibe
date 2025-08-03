// AI Chat Application
class AIChat {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChatHistory();
        this.updateStreak();
    }

    bindEvents() {
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');

        // Send message on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Send message on button click
        sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Auto-resize input
        messageInput.addEventListener('input', () => {
            this.autoResizeInput(messageInput);
        });
    }

    async sendMessage() {
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const message = messageInput.value.trim();

        if (!message || this.isTyping) return;

        // Check if API key is configured
        if (!CONFIG.OPENAI_API_KEY) {
            this.showError(CONFIG.ERROR_MESSAGES.NO_API_KEY);
            return;
        }

        // Clear input and disable send button
        messageInput.value = '';
        sendButton.disabled = true;
        this.autoResizeInput(messageInput);

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addMessage(response, 'ai');

        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.showError(this.getErrorMessage(error));
        } finally {
            // Re-enable send button
            sendButton.disabled = false;
        }
    }

    async getAIResponse(userMessage) {
        // Add user message to conversation history
        this.messages.push({ role: 'user', content: userMessage });

        // Prepare messages for API (include system prompt)
        const apiMessages = [
            { role: 'system', content: CONFIG.SYSTEM_PROMPT },
            ...this.messages.slice(-CONFIG.MAX_MESSAGES) // Keep last N messages
        ];

        const response = await fetch(CONFIG.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.OPENAI_MODEL,
                messages: apiMessages,
                max_tokens: 500,
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResponse = data.choices[0].message.content;
        
        // Add AI response to conversation history
        this.messages.push({ role: 'assistant', content: aiResponse });

        return aiResponse;
    }

    addMessage(content, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const timestamp = this.getCurrentTime();
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(content)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        this.saveChatHistory();
    }

    formatMessage(content) {
        // Convert line breaks to <br> tags and escape HTML
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        this.isTyping = true;
        const chatMessages = document.getElementById('chat-messages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    showError(message) {
        this.addMessage(`❌ ${message}`, 'ai');
    }

    getErrorMessage(error) {
        if (error.message.includes('401')) {
            return 'Invalid API key. Please check your OpenAI API key.';
        } else if (error.message.includes('429')) {
            return CONFIG.ERROR_MESSAGES.RATE_LIMIT;
        } else if (error.message.includes('fetch')) {
            return CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
        } else {
            return CONFIG.ERROR_MESSAGES.API_ERROR;
        }
    }

    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    scrollToBottom() {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    }

    saveChatHistory() {
        try {
            localStorage.setItem('ai-chat-history', JSON.stringify(this.messages));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('ai-chat-history');
            if (saved) {
                this.messages = JSON.parse(saved);
                // Only show last 10 messages to avoid overwhelming the UI
                const recentMessages = this.messages.slice(-10);
                recentMessages.forEach(msg => {
                    if (msg.role === 'user') {
                        this.addMessage(msg.content, 'user');
                    } else if (msg.role === 'assistant') {
                        this.addMessage(msg.content, 'ai');
                    }
                });
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    updateStreak() {
        // Simulate streak counter - you can implement your own logic
        const streakText = document.getElementById('streak-text');
        if (streakText) {
            const streak = Math.floor(Math.random() * 30) + 1;
            streakText.textContent = `${streak} day streak`;
        }
    }

    clearChat() {
        this.messages = [];
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        localStorage.removeItem('ai-chat-history');
        
        // Add welcome message back
        this.addMessage('How can I help you today? I\'m here to assist with your fitness and rehabilitation journey.', 'ai');
    }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChat();
});

// Add some utility functions to the global scope
window.clearAIChat = () => {
    if (window.aiChat) {
        window.aiChat.clearChat();
    }
}; 