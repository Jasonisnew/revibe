// Camera page specific JavaScript

// Camera state
let flashEnabled = false;
let stream = null;
let videoElement = null;
let canvasElement = null;
let isCameraActive = false;
let capturedPhotos = [];

// Initialize camera when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Camera page loaded');
    loadCapturedPhotos();
    setupCameraControls();
    initializeCamera();
});

// Clean up camera when page is unloaded
window.addEventListener('beforeunload', function() {
    cleanupCamera();
});

// Initialize camera functionality
async function initializeCamera() {
    try {
        // Request camera permissions
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use back camera if available
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        });
        
        // Create video element if it doesn't exist
        if (!videoElement) {
            videoElement = document.createElement('video');
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            videoElement.muted = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
        }
        
        // Create canvas element for photo capture
        if (!canvasElement) {
            canvasElement = document.createElement('canvas');
            canvasElement.style.display = 'none';
            document.body.appendChild(canvasElement);
        }
        
        // Set video source
        videoElement.srcObject = stream;
        
        // Replace placeholder with video
        const cameraView = document.querySelector('.camera-view');
        const placeholder = document.querySelector('.camera-placeholder');
        
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        cameraView.appendChild(videoElement);
        isCameraActive = true;
        
        console.log('Camera initialized successfully');
        showNotification('Camera ready!', 'success');
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showCameraError();
    }
}

// Capture photo function
function capturePhoto() {
    if (!isCameraActive || !videoElement || !canvasElement) {
        console.log('Camera not ready');
        showNotification('Camera not ready yet. Please wait...', 'warning');
        return;
    }
    
    try {
        // Set canvas dimensions to match video
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        
        // Draw video frame to canvas
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElement, 0, 0);
        
        // Convert to blob and download
        canvasElement.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `photo_${Date.now()}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.8);
        
        // Show feedback
        const captureBtn = document.querySelector('.capture-btn');
        captureBtn.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            captureBtn.style.transform = 'scale(1)';
        }, 150);
        
        // Show capture feedback
        showCaptureFeedback();
        
        // Add to captured photos
        const photoData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            flashUsed: flashEnabled
        };
        capturedPhotos.push(photoData);
        saveCapturedPhotos();
        
        console.log('Photo captured successfully');
        showNotification('Photo captured successfully!', 'success');
        
    } catch (error) {
        console.error('Error capturing photo:', error);
    }
}

// Toggle flash function
function toggleFlash() {
    flashEnabled = !flashEnabled;
    const flashBtn = document.querySelector('.control-btn:last-child i');
    
    if (flashEnabled) {
        flashBtn.style.color = '#fbbf24';
        flashBtn.style.textShadow = '0 0 10px #fbbf24';
        // Note: Flash control requires additional permissions and may not work on all devices
        console.log('Flash: ON (Note: May not work on all devices)');
        showNotification('Flash enabled', 'info');
    } else {
        flashBtn.style.color = '#ffffff';
        flashBtn.style.textShadow = 'none';
        console.log('Flash: OFF');
        showNotification('Flash disabled', 'info');
    }
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

// Show camera error
function showCameraError() {
    const cameraView = document.querySelector('.camera-view');
    const placeholder = document.querySelector('.camera-placeholder');
    
    if (placeholder) {
        placeholder.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Camera access denied</p>
            <p style="font-size: 0.875rem; opacity: 0.6;">Please allow camera permissions to use this feature</p>
        `;
        placeholder.style.display = 'block';
    }
}

// Switch camera (front/back)
function switchCamera() {
    if (!isCameraActive) return;
    
    // Stop current stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    // Reinitialize with different facing mode
    initializeCamera();
}

// Clean up camera when leaving page
function cleanupCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    isCameraActive = false;
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
    
    // Add camera pulse animation
    const style = document.createElement('style');
    style.textContent = `
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
}

// Export functions for potential use
window.cameraFunctions = {
    capturePhoto,
    toggleFlash,
    switchCamera,
    cleanupCamera,
    getPhotoCount,
    clearAllPhotos,
    showNotification
}; 