
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚀 main.tsx loading...');

// Register PWA manifest with better update handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, reload the page
                console.log('🔄 New content available, reloading...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('❌ SW registration failed: ', registrationError);
      });
  });
}

const container = document.getElementById("root");
if (!container) {
  console.error('❌ Root element not found');
  throw new Error('❌ Root element not found');
}

console.log('🎯 Creating React root...');
const root = createRoot(container);

console.log('🔧 Rendering App component...');

// Add error boundary for better debugging
window.addEventListener('error', (event) => {
  console.error('💥 Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled promise rejection:', event.reason);
});

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('💥 Error rendering App:', error);
  // Fallback UI
  root.render(
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Application Error</h1>
      <p>Failed to load the application. Check the console for details.</p>
      <details>
        <summary>Error Details</summary>
        <pre>{error instanceof Error ? error.stack : String(error)}</pre>
      </details>
    </div>
  );
}
