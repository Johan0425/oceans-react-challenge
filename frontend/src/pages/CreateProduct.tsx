/**
 * A React functional component for creating a new product.
 * This component provides a form to input product details such as name, description, price, and stock.
 * It uses `react-hook-form` for form handling and validation with `zod` schema.
 *
 * @component
 * @returns {JSX.Element} The rendered CreateProduct component.
 *
 * @remarks
 * - The form includes validation for required fields and specific constraints (e.g., price must be greater than 0).
 * - On successful submission, the form data is sent to the API endpoint `/products`.
 * - Displays error messages for validation errors and API submission errors.
 * - Includes a button to navigate back to the dashboard.
 *
 * @example
 * ```tsx
 * import CreateProduct from './CreateProduct';
 *
 * const App = () => {
 *   return <CreateProduct />;
 * };
 * ```
 *
 * @dependencies
 * - `react`
 * - `react-hook-form`
 * - `zod`
 * - `@hookform/resolvers/zod`
 * - `react-router-dom`
 *
 * @file
 * Located at `/src/pages/CreateProduct.tsx`.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api';
import { useNavigate } from 'react-router-dom'; 

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  price: z
    .number()
    .min(0.01, 'El precio debe ser mayor que 0')
    .refine((val) => !isNaN(val), { message: 'El precio debe ser un número' }),
  stock: z.number({
    message: 'El stock debe ser un número',
  }).int('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
});

type ProductFormInputs = z.infer<typeof productSchema>;

const CreateProduct: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset, // Importa reset para limpiar el formulario
    formState: { errors },
  } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormInputs) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      await api.post('/products', data);
      alert('Producto creado exitosamente');
      reset();
    } catch (error: any) {
      console.error('Error creando producto:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setSubmissionError(`Error al crear el producto: ${error.response.data.message}`);
      } else {
        setSubmissionError('Error al crear el producto. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-12">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 lg:p-12 border border-blue-100 animate-fade-in-up-delay">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 animate-fade-in-down-delay">
            Añadir Nuevo Producto 
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-fade-in-right"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {submissionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{submissionError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre del Producto
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="mt-1 block w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Ej: Hamburguesa Clásica"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="mt-1 block w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y"
              placeholder="Una breve descripción del producto..."
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
              Precio ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01" // Permite decimales para el precio
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Ej: 12.50"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-1">
              Stock Disponible
            </label>
            <input
              id="stock"
              type="number"
              step="1" 
              {...register('stock', { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Ej: 100"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting} 
            className={`w-full py-3 px-4 rounded-lg shadow-lg text-white font-semibold text-lg transition-all duration-300 transform
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
              }`}
          >
            {isSubmitting ? 'Creando Producto...' : 'Crear Producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;