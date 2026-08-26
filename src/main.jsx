import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('SafeDrive PWA Service Worker Registered:', reg.scope);
      })
      .catch((err) => {
        console.log('Service Worker Registration Failed:', err);
      });
  });
}

// Fix for Vercel SPA Chunk Load Errors on new deployments
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload(); 
});
window.addEventListener('error', (e) => {
  if (e.message && (e.message.includes('Failed to fetch dynamically imported module') || e.message.includes('Importing a module script failed'))) {
    window.location.reload();
  }
});
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && (e.reason.message.includes('Failed to fetch dynamically imported module') || e.reason.message.includes('Importing a module script failed'))) {
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
