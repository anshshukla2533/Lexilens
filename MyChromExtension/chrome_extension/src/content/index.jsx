import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentScript from './ContentScript';
import '../styles/global.css';

// Create a container for the React app
const container = document.createElement('div');
container.id = 'word-info-extension-root';
document.body.appendChild(container);

// Render the React component
const root = createRoot(container);
root.render(<ContentScript />);