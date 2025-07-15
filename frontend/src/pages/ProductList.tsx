
/**
 * The `ProductList` component is a React functional component that displays a list of products
 * fetched from an API. It includes features such as loading indicators, error handling, and
 * a responsive table to display product details.
 *
 * @component
 *
 * @typedef {Object} Product
 * @property {number} id - The unique identifier of the product.
 * @property {string} name - The name of the product.
 * @property {string} description - A brief description of the product.
 * @property {string} price - The price of the product, formatted as a string.
 * @property {number} stock - The available stock quantity of the product.
 *
 * @returns {JSX.Element} A React component that renders the product list.
 *
 * @remarks
 * - The component fetches product data from an API endpoint (`/products`) using an asynchronous
 *   function inside a `useEffect` hook.
 * - The `price` field is converted to a float during data transformation to ensure proper formatting.
 * - The component handles three states: loading, error, and displaying the product list.
 * - If no products are available, a message is displayed encouraging the user to add products.
 * - Includes a button to navigate back to the dashboard.
 *
 * @example
 * ```tsx
 * import ProductList from './ProductList';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <ProductList />
 *     </div>
 *   );
 * };
 *
 * export default App;
 * ```
 */

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string; 
  stock: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const fetchedProducts: Product[] = response.data.map((product: Product) => ({
          ...product,
          price: parseFloat(product.price), 
        }));
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 animate-fade-in-down">
            Catálogo de Productos
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-fade-in-right"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {error && (
          <div className="text-center py-4 text-red-600 text-lg">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-600 text-xl">
            <p>Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-xl">
            <p>No hay productos disponibles en este momento.</p>
            <p className="mt-2">¡Prueba a añadir algunos!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-blue-200 rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white text-left shadow-md">
                <tr>
                  <th className="py-3 px-6 border-b border-blue-700">ID</th>
                  <th className="py-3 px-6 border-b border-blue-700">Nombre</th>
                  <th className="py-3 px-6 border-b border-blue-700">Descripción</th>
                  <th className="py-3 px-6 border-b border-blue-700">Precio</th>
                  <th className="py-3 px-6 border-b border-blue-700">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-blue-100 hover:bg-blue-50 transition-all duration-200
                    ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.05}s` }} 
                  >
                    <td className="py-3 px-6 text-blue-800 font-semibold">{product.id}</td>
                    <td className="py-3 px-6 text-gray-800">{product.name}</td>
                    <td className="py-3 px-6 text-gray-600 max-w-xs truncate">{product.description || 'N/A'}</td>
                    <td className="py-3 px-6 text-green-700 font-bold">${(parseFloat(product.price) || 0).toFixed(2)}</td>
                    <td className="py-3 px-6 text-gray-700">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;