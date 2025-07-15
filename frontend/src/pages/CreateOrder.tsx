
/**
 * The `CreateOrder` component is a React functional component that allows users to create a new order
 * by selecting products, specifying quantities, and submitting the order. It interacts with a backend
 * API to fetch product data and submit the order payload.
 *
 * @component
 *
 * @description
 * This component provides the following features:
 * - Fetches a list of products from the backend API and displays them for selection.
 * - Allows users to add products to an order, adjust quantities, and remove items.
 * - Calculates the total cost of the order dynamically based on selected products and their quantities.
 * - Submits the order to the backend API with the required payload structure.
 * - Handles loading states, error states, and form submission states.
 *
 * @returns {JSX.Element} The rendered `CreateOrder` component.
 *
 * @interface Product
 * Represents a product fetched from the backend.
 * @property {number} id - The unique identifier of the product.
 * @property {string} name - The name of the product.
 * @property {string} description - A brief description of the product.
 * @property {number} price - The price of the product.
 * @property {number} stock - The available stock of the product.
 *
 * @interface OrderItemPayload
 * Represents the payload structure for an individual order item sent to the backend.
 * @property {number} product_id - The unique identifier of the product (in snake_case for backend compatibility).
 * @property {number} quantity - The quantity of the product in the order.
 * @property {number} price_at_time - The price of the product at the time of order creation.
 *
 * @state {Product[]} products - The list of products fetched from the backend.
 * @state {{ productId: number; quantity: number }[]} orderItems - The list of selected products and their quantities.
 * @state {number} total - The total cost of the order.
 * @state {boolean} loadingProducts - Indicates whether the product data is being loaded.
 * @state {string | null} errorProducts - Stores any error message encountered while fetching products.
 * @state {boolean} isSubmitting - Indicates whether the order is being submitted.
 *
 * @function handleAddItem
 * Adds a product to the order or increases its quantity if it already exists in the order.
 * @param {number} productId - The ID of the product to add or increase.
 *
 * @function handleDecreaseItem
 * Decreases the quantity of a product in the order or removes it if the quantity reaches zero.
 * @param {number} productId - The ID of the product to decrease.
 *
 * @function handleRemoveItem
 * Removes a product from the order entirely.
 * @param {number} productId - The ID of the product to remove.
 *
 * @function handleSubmit
 * Submits the order to the backend API. Validates the order, prepares the payload, and handles
 * success or error responses.
 *
 * @function fetchProducts
 * Fetches the list of products from the backend API and updates the `products` state.
 *
 * @function calculateTotal
 * Calculates the total cost of the order based on the selected products and their quantities.
 *
 * @hook useEffect
 * - Fetches products when the component mounts.
 * - Recalculates the total cost whenever `orderItems` or `products` change.
 *
 * @example
 * <CreateOrder />
 */

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface OrderItemPayload {
  product_id: number;
  quantity: number;
  price_at_time: number; 
}

const CreateOrder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<{ productId: number; quantity: number }[]>([]); 
  const [total, setTotal] = useState<number>(0);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const fetchedProducts: Product[] = response.data.map((product: { id: number; name: string; description: string; price: string; stock: string }) => ({ 
            ...product,
            price: parseFloat(product.price), 
            stock: parseInt(product.stock) 
        }));
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setErrorProducts('No se pudieron cargar los productos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    setTotal(newTotal);
  }, [orderItems, products]);

  const handleAddItem = (productId: number) => {
    setOrderItems((prevItems) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return prevItems;

      const existingItem = prevItems.find((item) => item.productId === productId);
      
      if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
          alert(`No hay suficiente stock para añadir más de "${product.name}". Stock disponible: ${product.stock}`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      if (1 > product.stock) {
        alert(`No hay stock disponible para "${product.name}". Stock disponible: ${product.stock}`);
        return prevItems;
      }
      return [...prevItems, { productId, quantity: 1 }];
    });
  };

  const handleDecreaseItem = (productId: number) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        if (existingItem.quantity - 1 <= 0) {
          return prevItems.filter((item) => item.productId !== productId);
        }
        return prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevItems;
    });
  };

  const handleRemoveItem = (productId: number) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const handleSubmit = async () => {
    if (orderItems.length === 0) {
      alert('No puedes crear una orden vacía. Añade al menos un producto.');
      return;
    }
  
    setIsSubmitting(true);
    try {
      const payloadItems: OrderItemPayload[] = orderItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          product_id: item.productId,
          quantity: item.quantity,
          price_at_time: product ? product.price : 0 
        };
      });

      const orderPayload = {
        orderItems: payloadItems
      };

      console.log('Sending order payload:', orderPayload); 

      const response = await api.post('/orders', orderPayload);
      alert('Orden creada exitosamente. ID: ' + response.data.id); 
      
      setOrderItems([]);
      setTotal(0);

      const updatedProductsResponse = await api.get('/products');
      setProducts(updatedProductsResponse.data.map((product: any) => ({
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock)
      })));

      navigate('/dashboard'); 
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Error creando la orden:', error);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Error al crear la orden: ${err.response.data.message}`);
      } else {
        alert('Error al crear la orden. Por favor, inténtalo de nuevo. Revisa la consola para más detalles.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-pulse-bg">
        <div className="text-blue-700 text-3xl font-semibold">Cargando productos...</div>
      </div>
    );
  }

  if (errorProducts) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-700 p-4">
        <p className="text-xl font-semibold mb-4">{errorProducts}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 lg:p-14 border border-blue-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 animate-fade-in-down-delay">
            Crear Nueva Orden 🛒
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-fade-in-right"
          >
            ← Volver al Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Seleccionar Productos</h2>
            {products.length === 0 ? (
              <p className="text-gray-600 italic">No hay productos disponibles para añadir a la orden.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-3 bg-white border border-blue-100 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div>
                      <span className="font-semibold text-gray-800">{product.name}</span>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)} | Stock: {product.stock}</p>
                    </div>
                    <button
                      onClick={() => handleAddItem(product.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Detalle de la Orden</h2>
            {orderItems.length === 0 ? (
              <p className="text-gray-600 italic text-center py-8">Tu orden está vacía. Añade productos de la lista.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {orderItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center p-3 bg-blue-50 border border-blue-100 rounded-md shadow-sm"
                    >
                      <div>
                        <span className="font-semibold text-gray-800">{product.name}</span>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity} | Total: ${(product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDecreaseItem(item.productId)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full shadow hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
                          aria-label={`Disminuir cantidad de ${product.name}`}
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleAddItem(item.productId)}
                          className="bg-green-500 text-white px-3 py-1 rounded-full shadow hover:bg-green-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
                          aria-label={`Aumentar cantidad de ${product.name}`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="bg-gray-400 text-white px-3 py-1 rounded-full shadow hover:bg-gray-500 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
                          aria-label={`Eliminar ${product.name} de la orden`}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t-2 border-blue-200 text-right">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Total: ${total.toFixed(2)}</h3>
              <button
                onClick={handleSubmit}
                disabled={orderItems.length === 0 || isSubmitting}
                className={`w-full px-6 py-3 rounded-lg shadow-xl text-white font-semibold text-lg transition-all duration-300
                  ${orderItems.length === 0 || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 transform hover:scale-105 active:scale-95'
                  }`}
              >
                {isSubmitting ? 'Creando Orden...' : 'Confirmar Orden'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;