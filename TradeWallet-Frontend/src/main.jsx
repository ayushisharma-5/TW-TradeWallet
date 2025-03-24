import { StrictMode } from 'react'; // Helps catch potential issues during development
import { createRoot } from 'react-dom/client'; // React 18's new rendering API
import './index.css'; // Global styles for the application
import App from './App.jsx'; // Root component of the application

// Find the root DOM element where the app will be mounted
const rootElement = document.getElementById('root');

// Created a root for the app and render it
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);