// Camera page specific JavaScript

// Camera state
let flashEnabled = false;

// Capture photo function
function capturePhoto() {
    // In a real app, this would access the device camera
    console.log('Photo captured!');
    
    // Show feedback
    const captureBtn = document.querySelector('.capture-btn');
    captureBtn.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        captureBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Simulate photo capture
    showCaptureFeedback();
}

// Toggle flash function
function toggleFlash() {
    flashEnabled = !flashEnabled;
    const flashBtn = document.querySelector('.control-btn:last-child i');
    
    if (flashEnabled) {
        flashBtn.style.color = '#fbbf24';
    } else {
        flashBtn.style.color = '#ffffff';
    }
    
    console.log('Flash:', flashEnabled ? 'ON' : 'OFF');
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

// Initialize camera page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Camera page loaded');
    
    // Add any initialization code here
    // In a real app, you would request camera permissions here
});

// Export functions for potential use
window.cameraFunctions = {
    capturePhoto,
    toggleFlash
}; 