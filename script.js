// DOM elements
const progressSlider = document.getElementById('progress-slider');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const progressPercentage = document.getElementById('progress-percentage');

// App state
let currentProgress = 60;
let isDragging = false;

// Update progress display
function updateProgress() {
    if (!progressSlider || !progressFill || !progressThumb) return;
    
    const progress = progressSlider.value;
    currentProgress = parseInt(progress);
    progressFill.style.width = `${progress}%`;
    progressThumb.style.left = `calc(${progress}% - 16px)`;
    updateProgressText();
    
    // Save progress to localStorage
    localStorage.setItem('userProgress', progress);
}

// Update progress text
function updateProgressText() {
    if (!progressSlider || !progressPercentage) return;
    
    const progress = progressSlider.value;
    progressPercentage.textContent = `${progress}% Complete`;
}

// Update time display
function updateTime() {
    const timeElements = document.querySelectorAll('.time');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Update current date
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Update calendar days
    const dayItems = document.querySelectorAll('.day-item');
    dayItems.forEach((item, index) => {
        const dayDate = item.querySelector('.day-date');
        if (dayDate) {
            const day = new Date();
            day.setDate(day.getDate() + index -2);
            dayDate.textContent = day.getDate().toString().padStart(2, '0');
            
            // Mark today as active
            if (index === 2) {
                dayDate.classList.add('active');
            } else {
                dayDate.classList.remove('active');
            }
        }
    });
}

// Load user progress from localStorage
function loadUserProgress() {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress && progressSlider) {
        progressSlider.value = savedProgress;
        updateProgress();
    }
}

// Navigation function
function navigateTo(path) {
    console.log('navigateTo function called with path:', path);
    
    try {
        // Convert route paths to actual HTML files with new folder structure
        let targetFile = path;
        
        if (path === '/') {
            // Check if we're in a subdirectory and need to go up
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
                targetFile = '../../index.html';
            } else {
                targetFile = 'index.html';
            }
        } else if (path.startsWith('/')) {
            const pageName = path.substring(1);
            // Check if we're in a subdirectory and need to go up
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
                targetFile = `../../pages/${pageName}/${pageName}.html`;
            } else {
                targetFile = `pages/${pageName}/${pageName}.html`;
            }
        }
        
        console.log(`Navigating to: ${targetFile}`);
        console.log(`Current path: ${window.location.pathname}`);
        
        // Navigate immediately
        window.location.href = targetFile;
        
    } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to simple navigation
        window.location.href = path;
    }
}

// Progress slider drag functionality
function setupProgressSlider() {
    if (!progressSlider) return;
    
    progressSlider.addEventListener('mousedown', () => {
        isDragging = true;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    progressSlider.addEventListener('input', updateProgress);
    progressSlider.addEventListener('change', () => {
        // Save progress when user finishes dragging
        localStorage.setItem('userProgress', progressSlider.value);
    });
}

// Update progress cards
function updateProgressCards() {
    const lowerCard = document.querySelector('.lower-card .card-value');
    const upperCard = document.querySelector('.upper-card .card-value');
    
    if (lowerCard) {
        const lowerProgress = Math.min(100, Math.floor(currentProgress * 0.5));
        lowerCard.textContent = `${lowerProgress}%`;
    }
    
    if (upperCard) {
        const upperProgress = Math.min(100, Math.floor(currentProgress * 0.85));
        upperCard.textContent = `${upperProgress}%`;
    }
}

// Add card hover effects
function setupCardEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Initialize the app
function initializeApp() {
    // Load saved progress
    loadUserProgress();
    
    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);
    
    // Update current date
    updateCurrentDate();
    
    // Setup progress slider
    setupProgressSlider();
    
    // Update progress cards
    updateProgressCards();
    
    // Setup card effects
    setupCardEffects();
    

}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initializeApp();
    
    // Initial progress update
    if (progressSlider) {
        updateProgress();
    }
});

// Export functions for potential use in other scripts
window.appFunctions = {
    navigateTo,
    updateProgress,
    updateTime,
    updateCurrentDate
};

// Make navigateTo globally accessible
window.navigateTo = navigateTo;

// Test function
console.log('Script loaded, navigateTo function available:', typeof navigateTo); 