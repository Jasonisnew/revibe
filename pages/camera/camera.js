// Camera app functionality for Fitness Rehab App
const URL = "../../assets/model2/";
let model, webcam, ctx, labelContainer, maxPredictions;
let isInitialized = false;
let currentMode = 'pose'; // Default to pose mode since we removed mode buttons
let lastPrediction = null;
let predictionUpdateTimer = null;
let currentExerciseIndex = 0; // Track current exercise

// DOM elements
let canvas, statusTime, predictionResults;

// Initialize the camera app
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    updateStatusTime();
    setInterval(updateStatusTime, 1000);
    
    // Auto-initialize camera
    init();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
});

function initializeElements() {
    canvas = document.getElementById("canvas");
    statusTime = document.getElementById("statusTime");
    predictionResults = document.getElementById("label-container");
}

// Handle orientation changes
function handleOrientationChange() {
    setTimeout(() => {
        if (isInitialized && webcam) {
            updateCanvasSize();
        }
    }, 100);
}

// Handle window resize
function handleResize() {
    if (isInitialized && webcam) {
        updateCanvasSize();
    }
}

// Update canvas size for proper fit
function updateCanvasSize() {
    // Use container dimensions instead of full viewport
    const container = document.querySelector('.camera-preview');
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Update webcam if it exists
    if (webcam) {
        webcam.width = rect.width;
        webcam.height = rect.height;
    }
}

// Update status bar time
function updateStatusTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    if (statusTime) {
        statusTime.textContent = timeString;
    }
}

// Enhanced prediction display - Stable and Centered
function updatePredictionDisplay(predictions) {
    if (!predictionResults) return;
    
    // Sort predictions by probability (highest first)
    const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
    const topPrediction = sortedPredictions[0];
    
    // Debug: Log all predictions to see what the new model is detecting
    console.log('All predictions:', predictions.map(p => `${p.className}: ${Math.round(p.probability * 100)}%`));
    
    // Only update if the prediction has changed significantly or after a delay
    if (shouldUpdatePrediction(topPrediction)) {
        // Clear existing predictions
        predictionResults.innerHTML = '';
        
        // Create simple, stable display
        const predictionDiv = document.createElement('div');
        predictionDiv.className = 'prediction-item';
        
        const className = topPrediction.className;
        const percentage = Math.round(topPrediction.probability * 100);
        
        // Simple centered display
        predictionDiv.innerHTML = `
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">${className}</div>
            <div style="font-size: 14px; opacity: 0.9;">${percentage}% confidence</div>
        `;
        
        predictionResults.appendChild(predictionDiv);
        
        // Make sure the prediction results are visible
        predictionResults.classList.add('show');
        
        // Update navigation bar labels based on prediction
        updateNavigationLabels(className, percentage);
        
        // Store the current prediction
        lastPrediction = {
            className: className,
            probability: topPrediction.probability,
            timestamp: Date.now()
        };
        
        // Set a timer to prevent rapid updates
        if (predictionUpdateTimer) {
            clearTimeout(predictionUpdateTimer);
        }
        predictionUpdateTimer = setTimeout(() => {
            predictionUpdateTimer = null;
        }, 500); // 500ms cooldown
    }
}

// Check if we should update the prediction display
function shouldUpdatePrediction(newPrediction) {
    if (!lastPrediction) return true;
    
    const timeDiff = Date.now() - lastPrediction.timestamp;
    const probDiff = Math.abs(newPrediction.probability - lastPrediction.probability);
    const classChanged = newPrediction.className !== lastPrediction.className;
    
    // Update if:
    // 1. Class has changed
    // 2. Probability changed significantly (>10%) and enough time has passed
    // 3. No recent updates (500ms cooldown)
    return classChanged || (probDiff > 0.1 && timeDiff > 500) || timeDiff > 1000;
}

// Teachable Machine Pose Model Integration
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load the model and metadata
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Get container dimensions for proper sizing
        const container = document.querySelector('.camera-preview');
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Setup webcam with container dimensions
        const flip = true;
        webcam = new tmPose.Webcam(width, height, flip);
        await webcam.setup();
        await webcam.play();
        
        // Setup canvas with container dimensions
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        
        // Setup prediction results
        labelContainer = document.getElementById("label-container");
        
        isInitialized = true;
        window.requestAnimationFrame(loop);
        
        console.log('Camera initialized successfully');
    } catch (error) {
        console.error('Failed to initialize camera:', error);
        showErrorMessage('Camera initialization failed. Please check permissions.');
    }
}

async function loop(timestamp) {
    if (webcam && isInitialized) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

async function predict() {
    if (!model || !webcam) return;
    
    try {
        // Run pose detection and show predictions (always on since we removed mode buttons)
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        const prediction = await model.predict(posenetOutput);

        // Update prediction display
        updatePredictionDisplay(prediction);

        // Draw everything in the correct order
        drawPose(pose);
    } catch (error) {
        console.error('Prediction error:', error);
    }
}

function drawPose(pose) {
    if (webcam.canvas && ctx) {
        // Clear the canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simply stretch the camera feed to fill the entire canvas
        // This will eliminate black space but may distort the image slightly
        ctx.drawImage(webcam.canvas, 0, 0, canvas.width, canvas.height);
        
        // Draw pose keypoints and skeleton on top if pose data exists
        if (pose && pose.keypoints && pose.keypoints.length > 0) {
            const minPartConfidence = 0.1; // Lower threshold to show more tracking
            
            // Ensure skeleton draws on top by using proper context settings
            ctx.save();
            
            // Set drawing properties for better visibility - BRIGHT BLUE SKELETON
            ctx.lineWidth = 6; // Very thick lines for maximum visibility
            ctx.strokeStyle = '#0066ff'; // BLUE for skeleton lines
            ctx.fillStyle = '#00ffff';   // Cyan for keypoints
            
            // Draw keypoints and skeleton with enhanced visibility
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            
            ctx.restore();
            
            // Debug: Log pose detection
            console.log('Pose detected with', pose.keypoints.length, 'keypoints');
        } else {
            console.log('No pose detected - drawing test circle');
            // Draw a test circle to see if canvas is working
            ctx.save();
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }
}

// Error handling
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 59, 48, 0.9);
        color: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        z-index: 1000;
        max-width: 300px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .prediction-item {
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(style);

// Exercise switching functionality
function switchToPreviousExercise() {
    // Decrement exercise index (you can add more exercises later)
    currentExerciseIndex = Math.max(0, currentExerciseIndex - 1);
    
    // Update the exercise label
    updateExerciseLabel();
    
    // For now, just show a notification
    // Later you can load different models here
    showExerciseNotification(`Switched to Exercise ${currentExerciseIndex + 1}`);
    
    console.log(`Switched to exercise ${currentExerciseIndex + 1}`);
}

function switchToNextExercise() {
    // Increment exercise index (you can add more exercises later)
    currentExerciseIndex = Math.min(9, currentExerciseIndex + 1); // Limit to 10 exercises for now
    
    // Update the exercise label
    updateExerciseLabel();
    
    // For now, just show a notification
    // Later you can load different models here
    showExerciseNotification(`Switched to Exercise ${currentExerciseIndex + 1}`);
    
    console.log(`Switched to exercise ${currentExerciseIndex + 1}`);
}

function showExerciseNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 1000;
        font-weight: 600;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Add slide down animation
const exerciseStyle = document.createElement('style');
exerciseStyle.textContent = `
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
`;
document.head.appendChild(exerciseStyle);

// Update navigation bar labels based on camera predictions
function updateNavigationLabels(className, percentage) {
    const class1Label = document.getElementById('class1-label');
    const class2Label = document.getElementById('class2-label');
    
    // Debug: Log what class is being detected
    console.log('Detected class:', className, 'with percentage:', percentage + '%');
    
    if (class1Label && class2Label) {
        // Handle different possible class names from the new model
        if (className === 'Class 1' || className === 'class1' || className === 'Class1') {
            class1Label.textContent = `Incorrect (${percentage}%)`;
            class1Label.style.color = '#ef4444'; // Red for incorrect
            class2Label.textContent = 'Correct';
            class2Label.style.color = '#6b7280'; // Gray for inactive
        } else if (className === 'Class 2' || className === 'class2' || className === 'Class2') {
            class1Label.textContent = 'Incorrect';
            class1Label.style.color = '#6b7280'; // Gray for inactive
            class2Label.textContent = `Correct (${percentage}%)`;
            class2Label.style.color = '#10b981'; // Green for correct
        } else {
            // For any other class names, show them dynamically
            class1Label.textContent = `${className} (${percentage}%)`;
            class1Label.style.color = '#10b981'; // Green for active class
            class2Label.textContent = 'Other Classes';
            class2Label.style.color = '#6b7280'; // Gray for inactive
        }
    }
}

// Update exercise label based on current exercise index
function updateExerciseLabel() {
    const exerciseLabel = document.getElementById('exercise-label');
    if (exerciseLabel) {
        exerciseLabel.textContent = `Exercise ${currentExerciseIndex + 1}`;
    }
}