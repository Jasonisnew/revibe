// Daily Plans page specific JavaScript

// Exercise state
let currentExercise = null;
let exerciseProgress = {};
let dailyStats = {};

// Exercise data with categories
const exercises = {
    // Arms exercises
    'side-arms-raise': {
        name: 'Side Arms Raise',
        duration: '3 minutes',
        category: 'arms',
        description: '3 sets x 10 reps • Improve arm mobility',
        icon: 'fas fa-hand-paper'
    },

    // Chest exercises
    'chest-opener': {
        name: 'Chest Opener',
        duration: '3 minutes',
        category: 'chest',
        description: '3 sets x 10 reps • Open chest muscles',
        icon: 'fas fa-heart'
    },

    // Thighs exercises
    'seated-knee-extension': {
        name: 'Seated Knee Extension',
        duration: '4 minutes',
        category: 'thighs',
        description: '3 sets x 12 reps • Strengthen quadriceps',
        icon: 'fas fa-arrows-alt-v'
    },
    'mini-squat': {
        name: 'Mini Squat',
        duration: '3 minutes',
        category: 'thighs',
        description: '3 sets x 10 reps • Strengthen hamstrings',
        icon: 'fas fa-walking'
    },

    // Shoulders exercises
    'w-shape-stretch': {
        name: 'Standing W',
        duration: '3 minutes',
        category: 'shoulders',
        description: '3 sets x 10 reps • Shoulder mobility',
        icon: 'fas fa-arrows-alt-h'
    },
    'y-shape-stretch': {
        name: 'Standing Y',
        duration: '3 minutes',
        category: 'shoulders',
        description: '3 sets x 10 reps • Shoulder flexibility',
        icon: 'fas fa-arrow-up'
    }
};

// Category data
const categories = {
    arms: {
        name: 'Arms',
        icon: 'fas fa-hand-paper',
        exercises: ['side-arms-raise']
    },
    chest: {
        name: 'Chest',
        icon: 'fas fa-heart',
        exercises: ['chest-opener']
    },
    thighs: {
        name: 'Thighs',
        icon: 'fas fa-walking',
        exercises: ['seated-knee-extension', 'mini-squat']
    },
    shoulders: {
        name: 'Shoulders',
        icon: 'fas fa-dumbbell',
        exercises: ['w-shape-stretch', 'y-shape-stretch']
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

// Switch category function
function switchCategory(categoryName) {
    // Update active category in sidebar
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeCategoryItem = document.querySelector(`[onclick="switchCategory('${categoryName}')"]`);
    if (activeCategoryItem) {
        activeCategoryItem.classList.add('active');
    }
    
    // Hide all exercise sections
    const exerciseSections = document.querySelectorAll('.exercise-section');
    exerciseSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected category section
    const targetSection = document.getElementById(`${categoryName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update progress for the selected category
    updateCategoryProgress(categoryName);
}

// Update category progress
function updateCategoryProgress(categoryName) {
    const category = categories[categoryName];
    if (!category) return;
    
    const completedExercises = category.exercises.filter(exerciseId => {
        const exercise = exercises[exerciseId];
        if (!exercise) return false;
        
        const exerciseItems = document.querySelectorAll('.exercise-item');
        for (let item of exerciseItems) {
            const exerciseName = item.querySelector('h4').textContent;
            if (exerciseName === exercise.name) {
                return item.classList.contains('completed');
            }
        }
        return false;
    }).length;
    
    const totalExercises = category.exercises.length;
    const progressPercentage = Math.round((completedExercises / totalExercises) * 100);
    
    console.log(`${category.name} progress: ${completedExercises}/${totalExercises} (${progressPercentage}%)`);
}

// Start exercise function - navigate to camera page
function startExercise(exerciseId) {
    const exercise = exercises[exerciseId];
    if (!exercise) {
        console.error('Exercise not found:', exerciseId);
        return;
    }
    
    console.log(`Starting exercise: ${exercise.name}`);
    
    // Store exercise data for camera page
    localStorage.setItem('currentExercise', JSON.stringify({
        id: exerciseId,
        name: exercise.name,
        duration: exercise.duration,
        category: exercise.category,
        description: exercise.description
    }));
    
    // Navigate to camera page
    navigateTo('/camera');
}

// Start all exercises in a category
function startCategoryExercises(categoryName) {
    const category = categories[categoryName];
    if (!category) {
        console.error('Category not found:', categoryName);
        return;
    }
    
    console.log(`Starting all exercises in category: ${category.name}`);
    
    // Store category data for camera page
    localStorage.setItem('currentCategory', JSON.stringify({
        name: categoryName,
        displayName: category.name,
        exercises: category.exercises
    }));
    
    // Navigate to camera page
    navigateTo('/camera');
}

// Start all exercises
function startAllExercises() {
    console.log('Starting all exercises');
    
    // Store all exercises data for camera page
    const allExercises = [];
    Object.keys(categories).forEach(categoryName => {
        const category = categories[categoryName];
        category.exercises.forEach(exerciseId => {
            const exercise = exercises[exerciseId];
            if (exercise) {
                allExercises.push({
                    id: exerciseId,
                    name: exercise.name,
                    duration: exercise.duration,
                    category: exercise.category,
                    description: exercise.description
                });
            }
        });
    });
    
    localStorage.setItem('allExercises', JSON.stringify(allExercises));
    
    // Navigate to camera page
    navigateTo('/camera');
}

// Update exercise status
function updateExerciseStatus(exerciseId, status) {
    const exercise = exercises[exerciseId];
    if (!exercise) return;
    
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach(item => {
        const exerciseName = item.querySelector('h4').textContent;
        if (exerciseName === exercise.name) {
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
            progressBar.style.background = 'linear-gradient(to right, #FFB0A3, #FFD3A7, #FFEB99, #BBF6C6)';
    }
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
    
    // Add click handlers for category start buttons
    const categoryStartButtons = document.querySelectorAll('.category-start-btn');
    categoryStartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryName = this.getAttribute('data-category');
            startCategoryExercises(categoryName);
        });
    });
    
    // Add animations
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
    
    console.log('Daily plans page loaded');
});

// Export functions for potential use
window.dailyPlansFunctions = {
    startExercise,
    startCategoryExercises,
    startAllExercises,
    switchCategory,
    updateCurrentDate,
    showNotification
}; 