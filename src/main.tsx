import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ✅ FIX #9: Dynamic --vh setter for old Android phones
// Computes actual viewport height excluding browser UI
(function initializeViewportHeight() {
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Set on initial load
  setVH();

  // Update on window resize
  window.addEventListener('resize', setVH, { passive: true });

  // Update on orientation change (mobile)
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
  }, { passive: true });

  // Update on visibility change (browser UI may change)
  window.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(setVH, 100);
    }
  }, { passive: true });
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
