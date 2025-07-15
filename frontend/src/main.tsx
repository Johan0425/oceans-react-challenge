

/**
 * Entry point of the React application.
 * 
 * This file sets up the root of the React application and renders the main component tree.
 * It includes the following:
 * 
 * - `React.StrictMode`: A wrapper that helps identify potential problems in the application.
 * - `BrowserRouter`: Provides routing capabilities using the HTML5 history API.
 * - `AuthProvider`: A context provider that manages authentication state and logic for the application.
 * - `App`: The root component of the application.
 * 
 * The application is rendered into the DOM element with the ID `root`.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);