// DOM elements
const progressSlider = document.getElementById('progress-slider');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const progressPercentage = document.getElementById('progress-percentage');

// Update progress display
function updateProgress() {
    if (!progressSlider || !progressFill || !progressThumb) return;
    
    const progress = progressSlider.value;
    progressFill.style.width = `${progress}%`;
    progressThumb.style.left = `calc(${progress}% - 16px)`;
    updateProgressText();
}

// Update progress text
function updateProgressText() {
    if (!progressSlider || !progressPercentage) return;
    
    const progress = progressSlider.value;
    progressPercentage.textContent = `${progress}% Complete`;
}

// Navigation function
function navigateTo(path) {
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
        
        // Add a small delay to ensure the console log is visible
        setTimeout(() => {
            window.location.href = targetFile;
        }, 100);
        
    } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to simple navigation
        window.location.href = path;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Progress slider
    if (progressSlider) {
        progressSlider.addEventListener('input', updateProgress);
    }

    // Initialize the app
    if (progressSlider) {
        updateProgress();
    }

    // Add click handlers for navigation
    const navItems = document.querySelectorAll('[onclick]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick && onclick.includes('navigateTo')) {
                const path = onclick.match(/navigateTo\('([^']+)'\)/)[1];
                navigateTo(path);
            }
        });
    });

    // Add hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Export functions for potential use in other scripts
window.appFunctions = {
    navigateTo
}; 