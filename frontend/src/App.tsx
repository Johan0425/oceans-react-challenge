

/**
 * The main application component that sets up routing and authentication context.
 * 
 * This component uses `react-router-dom` for defining routes and navigation within the application.
 * It also wraps the application with the `AuthProvider` to provide authentication context to child components.
 * 
 * Routes:
 * - `/`: Renders the `LoginPage` component.
 * - `/register`: Renders the `Register` component.
 * - `/login`: Renders the `LoginPage` component.
 * - `/products`: Renders the `ProductList` component.
 * - `/create-product`: Renders the `CreateProduct` component.
 * - `/create-order`: Renders the `CreateOrder` component.
 * - `/dashboard`: Renders the `Dashboard` component, protected by the `ProtectedRoute` component.
 * 
 * Protected Routes:
 * - The `ProtectedRoute` component ensures that only authenticated users can access the `/dashboard` route.
 * 
 * Context:
 * - The `AuthProvider` wraps the application to provide authentication-related state and functionality.
 * 
 * @component
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import CreateOrder from './pages/CreateOrder';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
      <AuthProvider> 
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-order" element={<CreateOrder />} />

          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
  );
};

export default App;