
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Support legacy hash links like /#/admin/login by migrating to standard path /admin/login
if (typeof window !== 'undefined' && window.location.hash && window.location.hash.startsWith('#/')) {
  const cleanPath = window.location.hash.slice(1);
  window.history.replaceState(null, '', cleanPath);
}

// Suppress and handle benign Web Locks AbortError ("Lock broken by another request with the 'steal' option")
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = String(reason?.message || reason || '');
    if (
      reason?.name === 'AbortError' ||
      msg.includes('steal') ||
      msg.includes('Lock broken by another request')
    ) {
      event.preventDefault();
      console.warn('Benign lock contention handled:', msg);
    }
  });
}

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element to mount to");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <FloatingWhatsApp />
      </BrowserRouter>
    </React.StrictMode>
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
