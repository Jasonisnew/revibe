# Fitness Rehab App - Vanilla JavaScript Version

This is a converted version of the Next.js React TypeScript fitness rehabilitation app, now built with vanilla JavaScript, HTML, and CSS.

## 📁 Project Structure

```
fitness-rehab-app/
├── index.html                    # Main home page
├── script.js                     # Core JavaScript functionality
├── styles.css                    # Global styles
├── pages/                        # All HTML pages organized by feature
│   ├── movements/
│   │   ├── movements.html       # Exercise selection page
│   │   ├── movements.css        # Movements page styles
│   │   └── movements.js         # Movements functionality
│   ├── ai-chat/
│   │   ├── ai-chat.html         # AI chat interface
│   │   ├── ai-chat.css          # AI chat styles
│   │   └── ai-chat.js           # AI chat functionality
│   ├── camera/
│   │   ├── camera.html          # Camera interface
│   │   ├── camera.css           # Camera styles
│   │   └── camera.js            # Camera functionality
│   └── daily-plans/
│       ├── daily-plans.html     # Daily exercise plans
│       ├── daily-plans.css      # Daily plans styles
│       └── daily-plans.js       # Daily plans functionality
├── assets/                       # Static assets
│   └── images/                  # Image assets (future use)
└── README.md                    # This file
```

## 🚀 Getting Started

1. **Open the project**: Simply open `index.html` in your web browser
2. **Navigate**: Use the bottom navigation to move between pages
3. **Interact**: Click on various elements to see the interactive features

## 📱 Pages Overview

### 🏠 Home Page (`index.html`)
- Progress tracking with interactive slider
- Daily plans overview
- Character video integration
- Navigation to other sections

### 💪 Movements Page (`pages/movements/movements.html`)
- Interactive body diagram
- Front/back view toggle
- Exercise category selection
- Search functionality
- Body part highlighting

### 🤖 AI Chat (`pages/ai-chat/ai-chat.html`)
- Real-time chat interface
- Typing indicators
- Message history
- Responsive design

### 📷 Camera (`pages/camera/camera.html`)
- Camera interface simulation
- Flash toggle
- Capture functionality
- Visual feedback

### 📅 Daily Plans (`pages/daily-plans/daily-plans.html`)
- Exercise progress tracking
- Exercise status management
- Progress visualization
- Interactive exercise list

## 🎨 Features

### Responsive Design
- Mobile-first approach
- Optimized for 375px width (iPhone SE)
- Flexible layouts

### Interactive Elements
- Progress sliders
- Hover effects
- Click animations
- Status indicators

### Modern UI
- Gradient backgrounds
- Smooth transitions
- Clean typography
- Consistent color scheme

## 🔧 Development Notes

### Adding New Pages
1. Create a new folder in `pages/`
2. Add the HTML file
3. Create corresponding CSS file
4. Create corresponding JS file
5. Update navigation in `script.js`

### File Naming Convention
- HTML files: `page-name.html`
- CSS files: `page-name.css`
- JS files: `page-name.js`
- Folders: `page-name/`

### Navigation System
The app uses a centralized navigation function in `script.js` that automatically converts route paths to the correct file paths based on the folder structure.

## 🌐 Browser Compatibility

This app works best in modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS Custom Properties
- Modern CSS animations

## 📈 Future Enhancements

- Real camera integration
- Local storage for user preferences
- More exercise categories
- Advanced progress analytics
- Offline functionality
- Push notifications
- Image assets in `assets/images/`

## 📝 License

This project is for educational and demonstration purposes.