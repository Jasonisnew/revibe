// Camera page specific JavaScript

// Camera state
let flashEnabled = false;
let cameraActive = false;
let capturedPhotos = [];

// Initialize camera
function initializeCamera() {
    console.log('Initializing camera...');
    
    // In a real app, this would request camera permissions
    // For demo purposes, we'll simulate camera activation
    setTimeout(() => {
        cameraActive = true;
        showCameraReady();
    }, 1000);
}

// Show camera ready notification
function showCameraReady() {
    const notification = createNotification('Camera ready!', 'success');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 2000);
}

// Capture photo function
function capturePhoto() {
    if (!cameraActive) {
        showNotification('Camera not ready yet. Please wait...', 'warning');
        return;
    }
    
    console.log('Photo captured!');
    
    // Show capture feedback
    const captureBtn = document.querySelector('.capture-btn');
    captureBtn.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        captureBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Simulate photo capture
    showCaptureFeedback();
    
    // Add to captured photos
    const photoData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        flashUsed: flashEnabled
    };
    capturedPhotos.push(photoData);
    
    // Save to localStorage
    saveCapturedPhotos();
    
    // Show success notification
    showNotification('Photo captured successfully!', 'success');
}

// Toggle flash function
function toggleFlash() {
    flashEnabled = !flashEnabled;
    const flashBtn = document.querySelector('.control-btn:last-child i');
    
    if (flashEnabled) {
        flashBtn.style.color = '#fbbf24';
        flashBtn.style.textShadow = '0 0 10px #fbbf24';
        showNotification('Flash enabled', 'info');
    } else {
        flashBtn.style.color = '#ffffff';
        flashBtn.style.textShadow = 'none';
        showNotification('Flash disabled', 'info');
    }
    
    console.log('Flash:', flashEnabled ? 'ON' : 'OFF');
}

// Show capture feedback
function showCaptureFeedback() {
    // Create a flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 9999;
        pointer-events: none;
        transition: opacity 0.3s ease-out;
    `;
    
    document.body.appendChild(flash);
    
    // Remove flash after animation
    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(flash)) {
                document.body.removeChild(flash);
            }
        }, 300);
    }, 100);
}

// Create notification
function createNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `camera-notification ${type}`;
    notification.textContent = message;
    
    // Style based on type
    const styles = {
        success: {
            background: 'linear-gradient(to right, #bbf7d0, #86efac)',
            color: '#166534',
            border: '1px solid #22c55e'
        },
        warning: {
            background: 'linear-gradient(to right, #fef3c7, #fdba74)',
            color: '#92400e',
            border: '1px solid #f59e0b'
        },
        info: {
            background: 'linear-gradient(to right, #dbeafe, #93c5fd)',
            color: '#1e40af',
            border: '1px solid #3b82f6'
        }
    };
    
    const style = styles[type] || styles.info;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
        font-size: 0.875rem;
        font-weight: 500;
        background: ${style.background};
        color: ${style.color};
        border: ${style.border};
    `;
    
    return notification;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = createNotification(message, type);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Save captured photos to localStorage
function saveCapturedPhotos() {
    localStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos));
}

// Load captured photos from localStorage
function loadCapturedPhotos() {
    const savedPhotos = localStorage.getItem('capturedPhotos');
    if (savedPhotos) {
        try {
            capturedPhotos = JSON.parse(savedPhotos);
        } catch (error) {
            console.error('Error loading captured photos:', error);
        }
    }
}

// Get photo count
function getPhotoCount() {
    return capturedPhotos.length;
}

// Clear all photos
function clearAllPhotos() {
    capturedPhotos = [];
    localStorage.removeItem('capturedPhotos');
    showNotification('All photos cleared', 'info');
}

// Add camera controls event listeners
function setupCameraControls() {
    // Capture button
    const captureBtn = document.querySelector('.capture-btn');
    if (captureBtn) {
        captureBtn.addEventListener('click', capturePhoto);
    }
    
    // Flash button
    const flashBtn = document.querySelector('.control-btn:last-child');
    if (flashBtn) {
        flashBtn.addEventListener('click', toggleFlash);
    }
    
    // Close button
    const closeBtn = document.querySelector('.control-btn:first-child');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            navigateTo('/');
        });
    }
}

// Add camera view simulation
function setupCameraView() {
    const cameraView = document.querySelector('.camera-view');
    if (cameraView) {
        // Add a subtle animation to simulate camera feed
        cameraView.style.background = 'linear-gradient(45deg, #1f2937, #374151)';
        cameraView.style.animation = 'cameraPulse 2s ease-in-out infinite';
        
        // Add camera grid overlay
        const grid = document.createElement('div');
        grid.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
        `;
        cameraView.appendChild(grid);
    }
}

// Initialize camera page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Camera page loaded');
    
    // Load captured photos
    loadCapturedPhotos();
    
    // Setup camera controls
    setupCameraControls();
    
    // Setup camera view
    setupCameraView();
    
    // Initialize camera
    initializeCamera();
    
    // Add camera pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cameraPulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
});

// Export functions for potential use
window.cameraFunctions = {
    capturePhoto,
    toggleFlash,
    getPhotoCount,
    clearAllPhotos,
    showNotification
}; 