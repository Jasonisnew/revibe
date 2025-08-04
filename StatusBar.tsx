import React, { useState, useEffect } from 'react';
import './status-bar.css';

interface StatusBarProps {
  battery?: number;
  isCharging?: boolean;
  hasWifi?: boolean;
  hasCellular?: boolean;
  signalStrength?: number; // 0-5 bars
}

const StatusBar: React.FC<StatusBarProps> = ({
  battery = 76,
  isCharging = false,
  hasWifi = true,
  hasCellular = true,
  signalStrength = 4
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setTime(timeString);
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const renderSignalBars = () => {
    const bars = [];
    for (let i = 0; i < 5; i++) {
      const height = i < signalStrength ? 8 : 4;
      const opacity = i < signalStrength ? 1 : 0.3;
      bars.push(
        <div
          key={i}
          className="signal-bar"
          style={{
            height: `${height}px`,
            opacity: opacity
          }}
          aria-label={`Signal bar ${i + 1} ${i < signalStrength ? 'active' : 'inactive'}`}
        />
      );
    }
    return bars;
  };

  const renderBattery = () => {
    const batteryWidth = Math.max(2, (battery / 100) * 22); // Min 2px width, max 22px
    
    return (
      <div className="battery-container" aria-label={`Battery ${battery}% ${isCharging ? 'charging' : ''}`}>
        <div className="battery-outline">
          <div 
            className={`battery-fill ${isCharging ? 'charging' : ''}`}
            style={{ width: `${batteryWidth}px` }}
          />
        </div>
        {isCharging && (
          <svg className="charging-icon" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 1L8 5H4L6 9L2 5H6Z" fill="currentColor" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="ios-status-bar">
      <div className="status-bar-content">
        <div className="time-display" aria-label={`Current time: ${time}`}>
          {time}
        </div>
        
        <div className="status-indicators">
          {hasCellular && (
            <div className="signal-bars" aria-label={`Cellular signal: ${signalStrength} bars`}>
              {renderSignalBars()}
            </div>
          )}
          
          {hasWifi && (
            <svg className="wifi-icon" viewBox="0 0 16 12" aria-label="WiFi connected">
              <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" fill="currentColor" />
              <path d="M4 6.5C5.65685 6.5 7 7.84315 7 9.5C7 11.1569 5.65685 12.5 4 12.5C2.34315 12.5 1 11.1569 1 9.5C1 7.84315 2.34315 6.5 4 6.5Z" fill="currentColor" opacity="0.7" />
              <path d="M12 6.5C13.6569 6.5 15 7.84315 15 9.5C15 11.1569 13.6569 12.5 12 12.5C10.3431 12.5 9 11.1569 9 9.5C9 7.84315 10.3431 6.5 12 6.5Z" fill="currentColor" opacity="0.7" />
              <path d="M0 3.5C2.76142 3.5 5 5.73858 5 8.5C5 11.2614 2.76142 13.5 0 13.5C-2.76142 13.5 -5 11.2614 -5 8.5C-5 5.73858 -2.76142 3.5 0 3.5Z" fill="currentColor" opacity="0.4" />
              <path d="M16 3.5C18.7614 3.5 21 5.73858 21 8.5C21 11.2614 18.7614 13.5 16 13.5C13.2386 13.5 11 11.2614 11 8.5C11 5.73858 13.2386 3.5 16 3.5Z" fill="currentColor" opacity="0.4" />
            </svg>
          )}
          
          {renderBattery()}
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 