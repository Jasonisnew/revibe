// Daily Plans page specific JavaScript

// Exercise state
let currentExercise = null;

// Start exercise function
function startExercise(exerciseType) {
    currentExercise = exerciseType;
    console.log(`Starting exercise: ${exerciseType}`);
    
    // Update UI to show exercise is active
    updateExerciseStatus(exerciseType, 'active');
    
    // In a real app, this would navigate to the exercise interface
    // For now, we'll just show a notification
    showExerciseNotification(exerciseType);
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
    }
}

// Show exercise notification
function showExerciseNotification(exerciseType) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'exercise-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-play"></i>
            <span>Starting ${exerciseType.replace('-', ' ')} exercise...</span>
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
    
    // Add animation styles
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
    `;
    document.head.appendChild(style);
    
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

// Complete exercise function
function completeExercise(exerciseType) {
    updateExerciseStatus(exerciseType, 'completed');
    currentExercise = null;
    
    // Show completion notification
    showCompletionNotification(exerciseType);
}

// Show completion notification
function showCompletionNotification(exerciseType) {
    const notification = document.createElement('div');
    notification.className = 'completion-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${exerciseType.replace('-', ' ')} exercise completed!</span>
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
    // Update current date
    updateCurrentDate();
    

    
    // Add click handlers for exercise items
    const exerciseItems = document.querySelectorAll('.exercise-item');
    exerciseItems.forEach(item => {
        item.addEventListener('click', function() {
            const exerciseName = this.querySelector('h4').textContent.toLowerCase();
            if (exerciseName.includes('upper body')) {
                startExercise('upper-body');
            } else if (exerciseName.includes('lower body')) {
                startExercise('lower-body');
            } else if (exerciseName.includes('cool down')) {
                startExercise('cool-down');
            }
        });
    });
    
    console.log('Daily plans page loaded');
});

// Export functions for potential use
window.dailyPlansFunctions = {
    startExercise,
    completeExercise,
    updateCurrentDate
}; 