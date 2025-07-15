
/**
 * Register component for user registration.
 *
 * This component provides a registration form where users can create an account.
 * It includes validation using `zod` and `react-hook-form`, and communicates with
 * the backend API to register the user. The form includes fields for username,
 * password, and password confirmation, with appropriate validation and error handling.
 *
 * Features:
 * - Validates input fields using `zod` schema.
 * - Displays error messages for invalid inputs or backend errors.
 * - Shows success messages upon successful registration.
 * - Optionally auto-logs in the user after registration and redirects to the dashboard.
 * - Redirects to the login page after successful registration if auto-login is not used.
 *
 * @component
 * @returns {React.FC} The Register component.
 *
 * @dependencies
 * - `react`: For building the component.
 * - `react-hook-form`: For form handling and validation.
 * - `zod` and `@hookform/resolvers/zod`: For schema-based validation.
 * - `react-router-dom`: For navigation and linking.
 * - `api`: Axios instance for API communication.
 * - `useAuth`: Context hook for authentication (optional for auto-login).
 *
 * @example
 * ```tsx
 * import Register from './Register';
 *
 * function App() {
 *   return <Register />;
 * }
 * ```
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; 
import { useAuth } from '../context/AuthContext'; 


const registerSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Debes confirmar la contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'], 
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setErrorMessage(null); 
    setSuccessMessage(null); 
    setIsSubmitting(true); 
    try {
      const response = await api.post('/register', {
        username: data.username,
        password: data.password,
      });

      setSuccessMessage(response.data.message || 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
      reset(); 
      if (response.data.token && response.data.role) {
        login(response.data.token, response.data.role);
        navigate('/dashboard');
      } else {
        setTimeout(() => {
          navigate('/login');
        }, 2000); 
      }

    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      setErrorMessage(error.response?.data?.message || 'Error en el registro. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800 animate-fade-in-down">
          Registrarse 👋
        </h2>

        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-sm"
            role="alert"
          >
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-sm"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-base font-semibold text-gray-700 mb-2">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className="mt-1 block w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
              placeholder="Crea un nombre de usuario"
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 block w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
              placeholder="Crea tu contraseña"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="mt-1 block w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
              placeholder="Confirma tu contraseña"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg shadow-xl text-white font-semibold text-lg transition-all duration-300 transform
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95'
              }`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold transition-colors duration-200">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;