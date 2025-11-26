import React from 'react';
import ReactDOM from 'react-dom/client';
// Import React-dependent libraries synchronously to ensure they initialize with React
// This prevents initialization errors when lazy-loaded components try to use them
import '@react-spring/web';
import 'lucide-react';
import './index.css';
import './components/terminal/terminal.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);