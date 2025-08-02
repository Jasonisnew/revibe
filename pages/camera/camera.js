// Camera page specific JavaScript

// Camera state
let flashEnabled = false;
let stream = null;
let videoElement = null;
let canvasElement = null;
let isCameraActive = false;

// Initialize camera when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Camera page loaded');
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
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showCameraError();
    }
}

// Capture photo function
function capturePhoto() {
    if (!isCameraActive || !videoElement || !canvasElement) {
        console.log('Camera not ready');
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
        
        console.log('Photo captured successfully');
        
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
        // Note: Flash control requires additional permissions and may not work on all devices
        console.log('Flash: ON (Note: May not work on all devices)');
    } else {
        flashBtn.style.color = '#ffffff';
        console.log('Flash: OFF');
    }
}

// Show capture feedback
function showCaptureFeedback() {
    // Create a flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    flash.style.zIndex = '9999';
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity 0.3s ease-out';
    
    document.body.appendChild(flash);
    
    // Remove flash after animation
    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(flash);
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

// Export functions for potential use
window.cameraFunctions = {
    capturePhoto,
    toggleFlash,
    switchCamera,
    cleanupCamera
}; 