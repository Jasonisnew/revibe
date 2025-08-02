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
});

// Clear search
clearSearch.addEventListener('click', function() {
    searchInput.value = '';
    clearSearch.classList.remove('visible');
    
    // Show all category cards
    categoryCards.forEach(card => {
        card.style.display = 'block';
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
        
        // Log the selection (in a real app, this would navigate to exercises)
        console.log(`Selected: ${partType} ${side || ''}`);
    });
});

function updateCategorySelection(partType) {
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



// Initialize movements page
document.addEventListener('DOMContentLoaded', function() {
    // Set up search placeholder
    searchInput.placeholder = 'Search Movement Name';
    
    // Initialize with front view
    setView('front');
});

// Export functions for potential use
window.movementsFunctions = {
    setView,
    selectCategory
}; 