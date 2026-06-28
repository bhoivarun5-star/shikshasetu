import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Intercept fetch calls to redirect /api/ requests to production backend if VITE_API_URL is configured
const originalFetch = window.fetch;
window.fetch = function (url, options = {}) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    url = `${baseUrl}${url}`;
    if (baseUrl) {
      options.credentials = 'include';
    }
  }
  return originalFetch(url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
