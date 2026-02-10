import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Root rendering logic for the Tappo application
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
