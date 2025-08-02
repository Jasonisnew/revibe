// Daily Plans page specific JavaScript

// Exercise state
let currentExercise = null;
let exerciseProgress = {};
let dailyStats = {};

// Exercise data
const exercises = {
    'morning-stretches': {
        name: 'Morning Stretches',
        duration: '10 minutes',
        category: 'warmup',
        description: 'Gentle stretching to improve flexibility and reduce stiffness'
    },
    'upper-body': {
        name: 'Upper Body Strength',
        duration: '20 minutes',
        category: 'strength',
        description: 'Focus on shoulder, arm, and chest exercises'
    },
    'lower-body': {
        name: 'Lower Body Mobility',
        duration: '15 minutes',
        category: 'mobility',
        description: 'Improve hip and knee range of motion'
    },
    'cool-down': {
        name: 'Cool Down',
        duration: '10 minutes',
        category: 'recovery',
        description: 'Gentle exercises to help your body recover'
    }
};

// Load exercise progress from localStorage
function loadExerciseProgress() {
    const savedProgress = localStorage.getItem('exerciseProgress');
    if (savedProgress) {
        try {
            exerciseProgress = JSON.parse(savedProgress);
        } catch (error) {
            console.error('Error loading exercise progress:', error);
        }
    }
    
    // Load daily stats
    const savedStats = localStorage.getItem('dailyStats');
    if (savedStats) {
        try {
            dailyStats = JSON.parse(savedStats);
        } catch (error) {
            console.error('Error loading daily stats:', error);
        }
    }
}

// Save exercise progress to localStorage
function saveExerciseProgress() {
    localStorage.setItem('exerciseProgress', JSON.stringify(exerciseProgress));
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
}

// Start exercise function
function startExercise(exerciseType) {
    if (currentExercise) {
        showNotification('Please complete the current exercise first', 'warning');
        return;
    }
    
    currentExercise = exerciseType;
    console.log(`Starting exercise: ${exerciseType}`);
    
    // Update UI to show exercise is active
    updateExerciseStatus(exerciseType, 'active');
    
    // Show exercise details modal
    showExerciseModal(exerciseType);
    
    // Start timer
    startExerciseTimer(exerciseType);
}

// Show exercise modal with details
function showExerciseModal(exerciseType) {
    const exercise = exercises[exerciseType];
    if (!exercise) return;
    
    const modal = document.createElement('div');
    modal.className = 'exercise-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${exercise.name}</h3>
                <button class="close-btn" onclick="closeExerciseModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p><strong>Duration:</strong> ${exercise.duration}</p>
                <p><strong>Category:</strong> ${exercise.category}</p>
                <p><strong>Description:</strong> ${exercise.description}</p>
                <div class="exercise-timer">
                    <div class="timer-display" id="timer-display">00:00</div>
                    <div class="timer-controls">
                        <button class="timer-btn" onclick="pauseExercise()">
                            <i class="fas fa-pause"></i>
                        </button>
                        <button class="timer-btn" onclick="completeExercise('${exerciseType}')">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
}

// Close exercise modal
function closeExerciseModal() {
    const modal = document.querySelector('.exercise-modal');
    if (modal) {
        modal.remove();
    }
    currentExercise = null;
}

// Start exercise timer
function startExerciseTimer(exerciseType) {
    const exercise = exercises[exerciseType];
    if (!exercise) return;
    
    // Parse duration (e.g., "20 minutes" -> 20)
    const duration = parseInt(exercise.duration.match(/\d+/)[0]);
    let timeRemaining = duration * 60; // Convert to seconds
    
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    const timer = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            completeExercise(exerciseType);
        }
    }, 1000);
    
    // Store timer reference
    window.currentTimer = timer;
}

// Pause exercise
function pauseExercise() {
    if (window.currentTimer) {
        clearInterval(window.currentTimer);
        showNotification('Exercise paused', 'info');
    }
}

// Complete exercise function
function completeExercise(exerciseType) {
    if (window.currentTimer) {
        clearInterval(window.currentTimer);
    }
    
    // Update exercise status
    updateExerciseStatus(exerciseType, 'completed');
    
    // Record completion
    const today = new Date().toISOString().split('T')[0];
    if (!exerciseProgress[today]) {
        exerciseProgress[today] = {};
    }
    exerciseProgress[today][exerciseType] = {
        completed: true,
        timestamp: new Date().toISOString()
    };
    
    // Update daily stats
    if (!dailyStats[today]) {
        dailyStats[today] = {
            completed: 0,
            total: Object.keys(exercises).length
        };
    }
    dailyStats[today].completed++;
    
    // Save progress
    saveExerciseProgress();
    
    // Close modal
    closeExerciseModal();
    
    // Update progress bar
    updateProgressBar();
    
    // Show completion notification
    showCompletionNotification(exerciseType);
}

// Update exercise status
function updateExerciseStatus(exerciseType, status) {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach(item => {
        const exerciseName = item.querySelector('h4').textContent.toLowerCase();
        if (exerciseName.includes(exerciseType.replace('-', ' '))) {
            // Remove all status classes
            item.classList.remove('completed', 'active');
            
            // Add new status class
            if (status === 'completed') {
                item.classList.add('completed');
                updateProgressBar();
            } else if (status === 'active') {
                item.classList.add('active');
            }
        }
    });
}

// Update progress bar
function updateProgressBar() {
    const completedExercises = document.querySelectorAll('.exercise-item.completed').length;
    const totalExercises = document.querySelectorAll('.exercise-item').length;
    const progressPercentage = Math.round((completedExercises / totalExercises) * 100);
    
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-percentage');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}%`;
        
        // Update progress card color based on percentage
        if (progressPercentage >= 80) {
            progressBar.style.background = 'linear-gradient(to right, #22c55e, #16a34a)';
        } else if (progressPercentage >= 50) {
            progressBar.style.background = 'linear-gradient(to right, #f59e0b, #d97706)';
        } else {
            progressBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
        }
    }
}

// Show exercise notification
function showExerciseNotification(exerciseType) {
    const exercise = exercises[exerciseType];
    if (!exercise) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'exercise-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-play"></i>
            <span>Starting ${exercise.name}...</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(to right, #fef3c7, #fdba74);
        color: #92400e;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Show completion notification
function showCompletionNotification(exerciseType) {
    const exercise = exercises[exerciseType];
    if (!exercise) return;
    
    const notification = document.createElement('div');
    notification.className = 'completion-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${exercise.name} completed!</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(to right, #bbf7d0, #86efac);
        color: #166534;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    `;
    
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

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const styles = {
        success: {
            background: 'linear-gradient(to right, #bbf7d0, #86efac)',
            color: '#166534'
        },
        warning: {
            background: 'linear-gradient(to right, #fef3c7, #fdba74)',
            color: '#92400e'
        },
        info: {
            background: 'linear-gradient(to right, #dbeafe, #93c5fd)',
            color: '#1e40af'
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
    `;
    
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

// Update current date
function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Initialize daily plans page
document.addEventListener('DOMContentLoaded', function() {
    // Load exercise progress
    loadExerciseProgress();
    
    // Update current date
    updateCurrentDate();
    
    // Update progress bar
    updateProgressBar();
    
    // Add click handlers for exercise items
    const exerciseItems = document.querySelectorAll('.exercise-item');
    exerciseItems.forEach(item => {
        item.addEventListener('click', function() {
            const exerciseName = this.querySelector('h4').textContent.toLowerCase();
            if (exerciseName.includes('morning stretches')) {
                startExercise('morning-stretches');
            } else if (exerciseName.includes('upper body')) {
                startExercise('upper-body');
            } else if (exerciseName.includes('lower body')) {
                startExercise('lower-body');
            } else if (exerciseName.includes('cool down')) {
                startExercise('cool-down');
            }
        });
    });
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
        
        .exercise-modal .modal-content {
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            max-width: 90%;
            width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .exercise-timer {
            text-align: center;
            margin-top: 1rem;
        }
        
        .timer-display {
            font-size: 2rem;
            font-weight: bold;
            color: #374151;
            margin-bottom: 1rem;
        }
        
        .timer-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .timer-btn {
            width: 3rem;
            height: 3rem;
            border: none;
            border-radius: 50%;
            background: linear-gradient(to bottom right, #fef3c7, #fdba74);
            color: #92400e;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .timer-btn:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
    
    console.log('Daily plans page loaded');
});

// Export functions for potential use
window.dailyPlansFunctions = {
    startExercise,
    completeExercise,
    updateCurrentDate,
    showNotification
}; 