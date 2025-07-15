
/**
 * A React functional component that acts as a protected route wrapper.
 * It checks if the user is authenticated by verifying the presence of a token.
 * If the token is not available, the user is redirected to the login page.
 * Otherwise, it renders the child routes using the `Outlet` component.
 *
 * @component
 * @returns {JSX.Element} The `Outlet` component if the user is authenticated, or a `Navigate` component to redirect to the login page.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;