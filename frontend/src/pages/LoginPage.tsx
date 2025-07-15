
/**
 * LoginPage Component
 *
 * This component renders a login page with a form for users to enter their credentials
 * (username and password) and log in. It uses React Hook Form for form handling and Zod
 * for schema validation. The component also integrates with an authentication context
 * (`useAuth`) to handle login functionality and redirects users to the dashboard upon
 * successful login.
 *
 * Features:
 * - Form validation with Zod to ensure required fields and password length.
 * - Displays error messages for invalid inputs or failed login attempts.
 * - Disables form inputs and button while submitting to prevent duplicate submissions.
 * - Provides a link to the registration page for users without an account.
 *
 * @component
 * @returns {React.FC} The LoginPage component.
 *
 * @dependencies
 * - `react`: For building the component.
 * - `react-hook-form`: For form state management and validation.
 * - `zod`: For schema-based validation.
 * - `@hookform/resolvers/zod`: To integrate Zod with React Hook Form.
 * - `react-router-dom`: For navigation and linking to other pages.
 * - `../context/AuthContext`: For authentication context to handle login.
 *
 * @example
 * ```tsx
 * import LoginPage from './LoginPage';
 *
 * const App = () => {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/login" element={<LoginPage />} />
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * };
 * ```
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom'; 

const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset 
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMessage(null); 
    setIsSubmitting(true); 
    try {
      await login(data.username, data.password); 
      reset(); 
      navigate('/dashboard'); 
    } catch (error: unknown) { 
      console.error('Error al iniciar sesión:', error);
      if (error instanceof Error && 'response' in error) {
        const responseError = error as { response?: { data?: { message?: string } } };
        setErrorMessage(responseError.response?.data?.message || 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
      } else {
        setErrorMessage('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800 animate-fade-in-down">
          Iniciar Sesión 🔐
        </h2>

        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-sm"
            role="alert"
          >
            <span className="block sm:inline">{errorMessage}</span>
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
              placeholder="Tu nombre de usuario"
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
              placeholder="••••••••"
              disabled={isSubmitting} 
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting} 
            className={`w-full py-3 px-4 rounded-lg shadow-xl text-white font-semibold text-lg transition-all duration-300 transform
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
              }`}
          >
            {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold transition-colors duration-200">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;