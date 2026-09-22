import React from 'react'
import './LoadingScreen.css'

export default function LoadingScreen({ progress = 0, currentItem = '', isComplete = false }) {
  return (
    <div className={`loading-screen-overlay ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-bg-backdrop" />
      
      <div className="loading-content-card">
        {/* Animated Bouquet Icon */}
        <div className="loading-bouquet-wrapper">
          <div className="loading-glow-ring" />
          <img
            src="/cartoon_lilies.png"
            alt="Loading Lilies"
            className="loading-bouquet-img"
          />
          <span className="loading-sparkle s1">✨</span>
          <span className="loading-sparkle s2">🌸</span>
          <span className="loading-sparkle s3">💖</span>
        </div>

        {/* Romantic Status Text */}
        <h2 className="loading-title">Se pregătesc amintirile noastre...</h2>
        <p className="loading-subtitle">
          {currentItem || 'Se optimizează fotografiile și videoclipurile pentru tine... 🌸'}
        </p>

        {/* Progress Bar Container */}
        <div className="loading-bar-track">
          <div
            className="loading-bar-fill"
            style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
          />
        </div>

        {/* Progress Percentage and Indicators */}
        <div className="loading-stats">
          <span className="loading-pct">{Math.round(progress)}%</span>
          <span className="loading-note">Fără lag, calitate maximă ✨</span>
        </div>
      </div>
    </div>
  )
}
