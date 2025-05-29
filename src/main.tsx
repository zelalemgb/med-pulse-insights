
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx loaded, React available:', !!React);

// Register PWA manifest
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

console.log('Creating React root...');
const root = createRoot(container);
console.log('Rendering App component...');
root.render(<App />);
