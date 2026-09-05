
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
