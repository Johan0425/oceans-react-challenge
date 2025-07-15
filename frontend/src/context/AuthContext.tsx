import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import api from '../api';

interface AuthContextType {
  isAuthenticated: boolean; 
  user: string | null; 
  userRole: string | null; 
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Context for managing authentication state and providing authentication-related functionality
 * throughout the application.
 *
 * @type {React.Context<AuthContextType | undefined>}
 * - `AuthContextType`: The type defining the shape of the authentication context.
 * - `undefined`: The initial value of the context, indicating that it has not been provided.
 *
 * This context should be used with a corresponding provider to ensure that the authentication
 * state and methods are accessible to components that consume it.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that provides authentication context to its children.
 * 
 * This component manages the authentication state, including the user's token, username, and role.
 * It also provides methods for logging in and logging out, and ensures that the authentication
 * token is included in API requests.
 * 
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * 
 * @returns {JSX.Element} The AuthContext.Provider component wrapping the children.
 * 
 * @property {boolean} isAuthenticated - Indicates whether the user is authenticated (based on the presence of a token).
 * @property {string | null} user - The username of the authenticated user, or null if not authenticated.
 * @property {string | null} userRole - The role of the authenticated user, or null if not authenticated.
 * @property {string | null} token - The authentication token, or null if not authenticated.
 * @property {Function} login - A function to log in the user. Accepts a username and password, and updates the authentication state.
 * @property {Function} logout - A function to log out the user. Clears the authentication state and redirects to the login page.
 * 
 * @example
 * ```tsx
 * import { AuthProvider } from './context/AuthContext';
 * 
 * const App = () => (
 *   <AuthProvider>
 *     <YourAppComponents />
 *   </AuthProvider>
 * );
 * ```
 */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<string | null>(localStorage.getItem('username')); 
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole')); 
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken')); 

  const isAuthenticated = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]); 

  /**
   * Logs in a user by sending their credentials to the authentication API.
   * 
   * This function sends a POST request to the `/auth/login` endpoint with the provided
   * username and password. Upon successful authentication, it stores the received token,
   * username, and user role in localStorage, updates the application state, and sets the
   * authorization header for future API requests. Finally, it navigates the user to the
   * dashboard page.
   * 
   * @param username - The username of the user attempting to log in.
   * @param password - The password of the user attempting to log in.
   * @throws {Error} Throws an error with a message if the login attempt fails. The error
   * message is either provided by the server or defaults to "Credenciales inválidas. Por favor, inténtalo de nuevo."
   */

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token: fetchedToken, user: fetchedUser, role: fetchedRole } = response.data; 

      // Store in localStorage
      localStorage.setItem('authToken', fetchedToken);
      localStorage.setItem('username', fetchedUser);
      localStorage.setItem('userRole', fetchedRole);

      setToken(fetchedToken);
      setUser(fetchedUser);
      setUserRole(fetchedRole);

      api.defaults.headers.common['Authorization'] = `Bearer ${fetchedToken}`;

      navigate('/dashboard'); 
    } catch (error: any) { 
      console.error('Login failed:', error);
    
      const message = error.response?.data?.message || 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
      throw new Error(message); 
    }
  };

  /**
   * Logs the user out by performing the following actions:
   * - Removes authentication-related data (`authToken`, `username`, `userRole`) from local storage.
   * - Resets the authentication state by setting `token`, `user`, and `userRole` to `null`.
   * - Deletes the `Authorization` header from the API's default headers.
   * - Redirects the user to the login page.
   *
   * @remarks
   * This function is typically used to handle user logout and ensure that
   * all authentication-related data is cleared from both the client-side
   * storage and the application state.
   */

  const logout = () => {
  
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');

    setToken(null);
    setUser(null);
    setUserRole(null);

    delete api.defaults.headers.common['Authorization'];

    navigate('/login'); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRole, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 *
 * This hook provides access to the `AuthContext` and ensures that it is used
 * within an `AuthProvider`. If the hook is called outside of an `AuthProvider`,
 * it will throw an error.
 *
 * @throws {Error} If the hook is used outside of an `AuthProvider`.
 * @returns {AuthContextType} The authentication context value.
 */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};


