
/**
 * API instance configured with Axios for making HTTP requests.
 * 
 * This module sets up an Axios instance with a base URL and includes interceptors
 * for handling authentication tokens and unauthorized responses.
 * 
 * - The request interceptor automatically attaches a `Bearer` token from localStorage
 *   to the `Authorization` header of outgoing requests, if available.
 * - The response interceptor handles `401 Unauthorized` responses by clearing the
 *   authentication token and user data from localStorage, and redirects the user
 *   to the login page.
 * 
 * @module api
 * @requires axios
 * 
 * @example
 * // Import the API instance
 * import api from './api';
 * 
 * // Example usage
 * api.get('/endpoint')
 *   .then(response => console.log(response.data))
 *   .catch(error => console.error(error));
 */

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001' , // Cambia esto según tu configuración
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas no autorizadas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Maneja el cierre de sesión directamente
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirige al inicio de sesión
    }
    return Promise.reject(error);
  }
);

export default api;