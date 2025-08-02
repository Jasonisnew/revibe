// Movements page specific JavaScript

// DOM elements
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const frontViewBtn = document.getElementById('front-view-btn');
const backViewBtn = document.getElementById('back-view-btn');
const bodyDiagram = document.getElementById('body-diagram');
const categoryCards = document.querySelectorAll('.category-card');
const bodyParts = document.querySelectorAll('.body-part');

// Current view state
let currentView = 'front';
let selectedCategory = null;
let selectedBodyPart = null;

// Exercise data for each body part
const exerciseData = {
    shoulder: {
        name: 'Shoulder Exercises',
        exercises: [
            { name: 'Shoulder Press', sets: 3, reps: 12, difficulty: 'Beginner' },
            { name: 'Lateral Raises', sets: 3, reps: 15, difficulty: 'Beginner' },
            { name: 'Front Raises', sets: 3, reps: 12, difficulty: 'Beginner' }
        ],
        description: 'Strengthen and improve shoulder mobility'
    },
    arm: {
        name: 'Arm Exercises',
        exercises: [
            { name: 'Bicep Curls', sets: 3, reps: 12, difficulty: 'Beginner' },
            { name: 'Tricep Dips', sets: 3, reps: 10, difficulty: 'Intermediate' },
            { name: 'Hammer Curls', sets: 3, reps: 12, difficulty: 'Beginner' }
        ],
        description: 'Build arm strength and definition'
    },
    chest: {
        name: 'Chest Exercises',
        exercises: [
            { name: 'Push-ups', sets: 3, reps: 10, difficulty: 'Beginner' },
            { name: 'Chest Press', sets: 3, reps: 12, difficulty: 'Beginner' },
            { name: 'Dumbbell Flyes', sets: 3, reps: 12, difficulty: 'Intermediate' }
        ],
        description: 'Develop chest strength and stability'
    },
    back: {
        name: 'Back Exercises',
        exercises: [
            { name: 'Rows', sets: 3, reps: 12, difficulty: 'Beginner' },
            { name: 'Pull-ups', sets: 3, reps: 8, difficulty: 'Advanced' },
            { name: 'Lat Pulldowns', sets: 3, reps: 12, difficulty: 'Intermediate' }
        ],
        description: 'Strengthen back muscles and improve posture'
    },
    quadriceps: {
        name: 'Quadriceps Exercises',
        exercises: [
            { name: 'Squats', sets: 3, reps: 15, difficulty: 'Beginner' },
            { name: 'Lunges', sets: 3, reps: 12, difficulty: 'Intermediate' },
            { name: 'Leg Press', sets: 3, reps: 12, difficulty: 'Intermediate' }
        ],
        description: 'Build leg strength and stability'
    },
    hamstrings: {
        name: 'Hamstring Exercises',
        exercises: [
            { name: 'Deadlifts', sets: 3, reps: 10, difficulty: 'Intermediate' },
            { name: 'Leg Curls', sets: 3, reps: 12, difficulty: 'Beginner' },
            { name: 'Good Mornings', sets: 3, reps: 12, difficulty: 'Intermediate' }
        ],
        description: 'Strengthen hamstrings and improve balance'
    }
};

// Search functionality
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
        clearSearch.classList.add('visible');
    } else {
        clearSearch.classList.remove('visible');
    }
    
    // Filter category cards based on search term
    categoryCards.forEach(card => {
        const cardText = card.querySelector('span').textContent.toLowerCase();
        if (cardText.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Also filter body parts
    bodyParts.forEach(part => {
        const partType = part.dataset.part;
        if (partType && partType.includes(searchTerm)) {
            part.style.opacity = '1';
        } else if (searchTerm.length > 0) {
            part.style.opacity = '0.3';
        } else {
            part.style.opacity = '1';
        }
    });
});

// Clear search
clearSearch.addEventListener('click', function() {
    searchInput.value = '';
    clearSearch.classList.remove('visible');
    
    // Show all category cards
    categoryCards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Reset body part opacity
    bodyParts.forEach(part => {
        part.style.opacity = '1';
    });
});

// View toggle functionality
frontViewBtn.addEventListener('click', function() {
    setView('front');
});

backViewBtn.addEventListener('click', function() {
    setView('back');
});

function setView(view) {
    currentView = view;
    
    // Update button states
    if (view === 'front') {
        frontViewBtn.classList.add('active');
        backViewBtn.classList.remove('active');
    } else {
        backViewBtn.classList.add('active');
        frontViewBtn.classList.remove('active');
    }
    
    // Update body diagram
    updateBodyDiagram(view);
}

function updateBodyDiagram(view) {
    const frontView = bodyDiagram.querySelector('.front-view');
    const backView = bodyDiagram.querySelector('.back-view');
    
    if (view === 'front') {
        frontView.classList.add('visible');
        backView.classList.remove('visible');
    } else {
        backView.classList.add('visible');
        frontView.classList.remove('visible');
    }
}

// Category card interactions
categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;
        selectCategory(category);
    });
});

function selectCategory(category) {
    selectedCategory = category;
    
    // Remove active state from all cards
    categoryCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active state to selected card
    const selectedCard = document.querySelector(`[data-category="${category}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // Highlight corresponding body parts
    highlightBodyParts(category);
    
    // Show exercise details
    showExerciseDetails(category);
}

function highlightBodyParts(category) {
    // Remove active state from all body parts
    bodyParts.forEach(part => {
        part.classList.remove('active');
    });
    
    // Add active state to matching body parts
    const matchingParts = document.querySelectorAll(`[data-part="${category}"]`);
    matchingParts.forEach(part => {
        part.classList.add('active');
    });
}

// Show exercise details modal
function showExerciseDetails(category) {
    const exerciseInfo = exerciseData[category];
    if (!exerciseInfo) return;
    
    // Remove existing modal
    const existingModal = document.querySelector('.exercise-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'exercise-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${exerciseInfo.name}</h3>
                <button class="close-btn" onclick="closeExerciseModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="exercise-description">${exerciseInfo.description}</p>
                <div class="exercises-list">
                    <h4>Recommended Exercises:</h4>
                    ${exerciseInfo.exercises.map(exercise => `
                        <div class="exercise-item">
                            <div class="exercise-info">
                                <h5>${exercise.name}</h5>
                                <p>${exercise.sets} sets × ${exercise.reps} reps</p>
                                <span class="difficulty ${exercise.difficulty.toLowerCase()}">${exercise.difficulty}</span>
                            </div>
                            <button class="start-exercise-btn" onclick="startExercise('${category}', '${exercise.name}')">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    `).join('')}
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
}

// Start exercise
function startExercise(category, exerciseName) {
    console.log(`Starting ${exerciseName} for ${category}`);
    
    // Show notification
    showNotification(`Starting ${exerciseName}...`, 'success');
    
    // In a real app, this would navigate to the exercise interface
    // For now, we'll just show a notification
    setTimeout(() => {
        showNotification(`${exerciseName} completed! Great job!`, 'success');
    }, 3000);
}

// Body part interactions
bodyParts.forEach(part => {
    part.addEventListener('click', function() {
        const partType = this.dataset.part;
        const side = this.dataset.side;
        
        // Remove active state from all parts
        bodyParts.forEach(p => p.classList.remove('active'));
        
        // Add active state to clicked part
        this.classList.add('active');
        
        // Update category selection
        updateCategorySelection(partType);
        
        // Show exercise details
        showExerciseDetails(partType);
        
        // Log the selection
        console.log(`Selected: ${partType} ${side || ''}`);
    });
});

function updateCategorySelection(partType) {
    selectedBodyPart = partType;
    
    // Remove active state from all category cards
    categoryCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active state to matching category card
    const matchingCard = document.querySelector(`[data-category="${partType}"]`);
    if (matchingCard) {
        matchingCard.classList.add('active');
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

// Initialize movements page
document.addEventListener('DOMContentLoaded', function() {
    // Set up search placeholder
    searchInput.placeholder = 'Search Movement Name';
    
    // Initialize with front view
    setView('front');
    
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
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .exercise-description {
            color: #6b7280;
            margin-bottom: 1rem;
        }
        
        .exercises-list h4 {
            margin-bottom: 1rem;
            color: #374151;
        }
        
        .exercise-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .exercise-info h5 {
            margin: 0 0 0.25rem 0;
            color: #374151;
        }
        
        .exercise-info p {
            margin: 0 0 0.25rem 0;
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .difficulty {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-weight: 500;
        }
        
        .difficulty.beginner {
            background: #bbf7d0;
            color: #166534;
        }
        
        .difficulty.intermediate {
            background: #fef3c7;
            color: #92400e;
        }
        
        .difficulty.advanced {
            background: #fecaca;
            color: #dc2626;
        }
        
        .start-exercise-btn {
            width: 2.5rem;
            height: 2.5rem;
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
        
        .start-exercise-btn:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
});

// Export functions for potential use
window.movementsFunctions = {
    setView,
    selectCategory,
    showExerciseDetails,
    startExercise
}; 