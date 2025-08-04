// iOS Status Bar Implementation
class IOSStatusBar {
    constructor(options = {}) {
        this.options = {
            battery: options.battery || 76,
            isCharging: options.isCharging || false,
            hasWifi: options.hasWifi !== undefined ? options.hasWifi : true,
            hasCellular: options.hasCellular !== undefined ? options.hasCellular : true,
            signalStrength: options.signalStrength || 4
        };
        
        this.timeElement = null;
        this.init();
    }

    init() {
        // Create status bar if it doesn't exist
        if (!document.querySelector('.ios-status-bar')) {
            this.createStatusBar();
        }
        
        this.timeElement = document.querySelector('.time-display');
        this.updateTime();
        this.updateBattery();
        
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
        
        // Update battery every 30 seconds (simulate real battery changes)
        setInterval(() => this.updateBattery(), 30000);
    }

    createStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.className = 'ios-status-bar';
        statusBar.innerHTML = `
            <div class="status-bar-content">
                <div class="time-display" aria-label="Current time"></div>
                <div class="status-indicators">
                    ${this.options.hasCellular ? `
                        <div class="signal-bars" aria-label="Cellular signal">
                            ${this.renderSignalBars()}
                        </div>
                    ` : ''}
                    ${this.options.hasWifi ? `
                        <svg class="wifi-icon" viewBox="0 0 16 12" aria-label="WiFi connected">
                            <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" fill="currentColor" />
                            <path d="M4 6.5C5.65685 6.5 7 7.84315 7 9.5C7 11.1569 5.65685 12.5 4 12.5C2.34315 12.5 1 11.1569 1 9.5C1 7.84315 2.34315 6.5 4 6.5Z" fill="currentColor" opacity="0.7" />
                            <path d="M12 6.5C13.6569 6.5 15 7.84315 15 9.5C15 11.1569 13.6569 12.5 12 12.5C10.3431 12.5 9 11.1569 9 9.5C9 7.84315 10.3431 6.5 12 6.5Z" fill="currentColor" opacity="0.7" />
                            <path d="M0 3.5C2.76142 3.5 5 5.73858 5 8.5C5 11.2614 2.76142 13.5 0 13.5C-2.76142 13.5 -5 11.2614 -5 8.5C-5 5.73858 -2.76142 3.5 0 3.5Z" fill="currentColor" opacity="0.4" />
                            <path d="M16 3.5C18.7614 3.5 21 5.73858 21 8.5C21 11.2614 18.7614 13.5 16 13.5C13.2386 13.5 11 11.2614 11 8.5C11 5.73858 13.2386 3.5 16 3.5Z" fill="currentColor" opacity="0.4" />
                        </svg>
                    ` : ''}
                    <div class="battery-container" aria-label="Battery level">
                        <div class="battery-outline">
                            <div class="battery-fill" style="width: 20px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertBefore(statusBar, document.body.firstChild);
    }

    renderSignalBars() {
        let bars = '';
        for (let i = 0; i < 5; i++) {
            const height = i < this.options.signalStrength ? 8 : 4;
            const opacity = i < this.options.signalStrength ? 1 : 0.3;
            bars += `<div class="signal-bar" style="height: ${height}px; opacity: ${opacity};" aria-label="Signal bar ${i + 1} ${i < this.options.signalStrength ? 'active' : 'inactive'}"></div>`;
        }
        return bars;
    }

    updateTime() {
        if (this.timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            this.timeElement.textContent = timeString;
            this.timeElement.setAttribute('aria-label', `Current time: ${timeString}`);
        }
    }

    updateBattery() {
        const batteryFill = document.querySelector('.battery-fill');
        const batteryContainer = document.querySelector('.battery-container');
        
        if (batteryFill && batteryContainer) {
            // Simulate battery changes (in real app, this would come from device API)
            const batteryWidth = Math.max(2, (this.options.battery / 100) * 22);
            
            batteryFill.style.width = `${batteryWidth}px`;
            batteryFill.className = `battery-fill ${this.options.isCharging ? 'charging' : ''}`;
            
            // Update charging icon
            let chargingIcon = batteryContainer.querySelector('.charging-icon');
            if (this.options.isCharging && !chargingIcon) {
                chargingIcon = document.createElement('svg');
                chargingIcon.className = 'charging-icon';
                chargingIcon.setAttribute('viewBox', '0 0 12 12');
                chargingIcon.setAttribute('aria-hidden', 'true');
                chargingIcon.innerHTML = '<path d="M6 1L8 5H4L6 9L2 5H6Z" fill="currentColor" />';
                batteryContainer.appendChild(chargingIcon);
            } else if (!this.options.isCharging && chargingIcon) {
                chargingIcon.remove();
            }
            
            batteryContainer.setAttribute('aria-label', `Battery ${this.options.battery}% ${this.options.isCharging ? 'charging' : ''}`);
        }
    }

    // Public methods to update status bar properties
    setBattery(level, isCharging = false) {
        this.options.battery = Math.max(0, Math.min(100, level));
        this.options.isCharging = isCharging;
        this.updateBattery();
    }

    setSignalStrength(strength) {
        this.options.signalStrength = Math.max(0, Math.min(5, strength));
        const signalBars = document.querySelector('.signal-bars');
        if (signalBars) {
            signalBars.innerHTML = this.renderSignalBars();
        }
    }

    setWifi(hasWifi) {
        this.options.hasWifi = hasWifi;
        this.init(); // Reinitialize to update WiFi icon
    }

    setCellular(hasCellular) {
        this.options.hasCellular = hasCellular;
        this.init(); // Reinitialize to update cellular signal
    }
}

// Initialize status bar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global status bar instance
    window.iosStatusBar = new IOSStatusBar({
        battery: 76,
        isCharging: false,
        hasWifi: true,
        hasCellular: true,
        signalStrength: 4
    });
    
    // Example: Update battery level every 30 seconds (simulate real device)
    setInterval(() => {
        const currentBattery = window.iosStatusBar.options.battery;
        const newBattery = Math.max(0, currentBattery - Math.random() * 2);
        window.iosStatusBar.setBattery(newBattery, false);
    }, 30000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IOSStatusBar;
} 