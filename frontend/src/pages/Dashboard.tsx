

/**
 * Dashboard component that serves as the main control panel for the application.
 * It displays recent orders, allows sorting of orders, and provides navigation links
 * to other parts of the application. The component also handles user authentication
 * and logout functionality.
 *
 * @component
 *
 * @typedef {Object} OrderItem
 * @property {number} id - The ID of the order item itself.
 * @property {number} order_id - The ID of the associated order.
 * @property {number} product_id - The ID of the product in the order item.
 * @property {number} quantity - The quantity of the product in the order item.
 * @property {string} price_at_time - The price of the product at the time of the order (string from backend).
 * @property {string} productName - The name of the product (frontend only, derived/added).
 *
 * @typedef {Object} Order
 * @property {number} id - The ID of the order.
 * @property {number} user_id - The ID of the user who placed the order.
 * @property {string} total - The total amount of the order (string from backend).
 * @property {string} status - The status of the order.
 * @property {string} created_at - The creation date of the order (ISO 8601 string).
 * @property {OrderItem[]} order_items - The list of items in the order.
 *
 * @typedef {'created_at' | 'total' | 'id'} SortKey - The key used for sorting orders.
 * @typedef {'asc' | 'desc'} SortDirection - The direction used for sorting orders.
 *
 * @returns {JSX.Element} The rendered Dashboard component.
 *
 * @remarks
 * - Fetches orders from the backend and processes them for display.
 * - Allows sorting of orders by date, total, or ID.
 * - Displays detailed information for each order, including its items.
 * - Provides navigation links to manage products and orders.
 * - Handles user authentication and logout functionality.
 *
 * @example
 * // Example usage:
 * import Dashboard from './Dashboard';
 * 
 * function App() {
 *   return <Dashboard />;
 * }
 */

import React, { useEffect, useState, useMemo } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: number; 
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: string; 
  productName: string; 
}

interface Order {
  id: number;
  user_id: number;
  total: string; 
  status: string;
  created_at: string; 
  order_items: OrderItem[]; 
}

type SortKey = 'created_at' | 'total' | 'id'; 
type SortDirection = 'asc' | 'desc';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('created_at'); 
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc'); 
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        console.log("Raw orders data from backend (GET /orders):", response.data); 
        const fetchedOrders: Order[] = response.data.map((order: any) => {
          const processedOrder: Order = {
            id: order.id,
            user_id: order.user_id,
            total: order.total, 
            status: order.status,
            created_at: order.created_at, 
            order_items: [] 
          };

          if (Array.isArray(order.order_items)) {
            processedOrder.order_items = order.order_items.map((item: any) => ({
              id: item.id,
              order_id: item.order_id,
              product_id: item.product_id,
              quantity: item.quantity,
              price_at_time: item.price_at_time, 
              productName: item.product_name || `Producto ID: ${item.product_id}` 
            }));
          } else {
            console.warn(`Order ${order.id} has no or invalid 'order_items' property:`, order.order_items);
          }
          return processedOrder;
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, logout]); 

  const sortedOrders = useMemo(() => {
    const sortableOrders = [...orders];

    sortableOrders.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (sortKey === 'created_at') {
        valueA = new Date(a.created_at).getTime();
        valueB = new Date(b.created_at).getTime();
        if (isNaN(valueA) && isNaN(valueB)) return 0;
        if (isNaN(valueA)) return sortDirection === 'asc' ? 1 : -1;
        if (isNaN(valueB)) return sortDirection === 'asc' ? -1 : 1;
      } else if (sortKey === 'total') {
        valueA = parseFloat(a.total); 
        valueB = parseFloat(b.total);
        if (isNaN(valueA) && isNaN(valueB)) return 0;
        if (isNaN(valueA)) return sortDirection === 'asc' ? 1 : -1;
        if (isNaN(valueB)) return sortDirection === 'asc' ? -1 : 1;
      } else if (sortKey === 'id') {
        valueA = a.id;
        valueB = b.id;
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sortableOrders;
  }, [orders, sortKey, sortDirection]);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return date.toLocaleString();
    } catch (e) {
      console.error('Failed to parse date:', dateString, e);
      return 'Fecha inválida (error)';
    }
  };

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 lg:p-14 border border-blue-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-blue-100">
          <h1 className="text-5xl font-extrabold text-blue-900 leading-tight animate-fade-in-down-delay">
            Panel de Control 📊
          </h1>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mb-12 p-8 bg-blue-700 shadow-2xl rounded-2xl border-4 border-blue-800 animate-fade-in-up-delay">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Navegación Principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/products" className="dashboard-card group">
              <div className="dashboard-card-inner">
                <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🍽️</span>
                <span className="text-xl font-semibold">Ver y Gestionar Productos</span>
              </div>
            </Link>
            <Link to="/create-order" className="dashboard-card group">
              <div className="dashboard-card-inner">
                <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🧾</span>
                <span className="text-xl font-semibold">Gestionar Órdenes</span>
              </div>
            </Link>
            <Link to="/create-product" className="dashboard-card group">
              <div className="dashboard-card-inner">
                <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">✨</span>
                <span className="text-xl font-semibold">Crear Nuevo Producto</span>
              </div>
            </Link>
          </div>
        </div>

        <hr className="my-10 border-t-2 border-blue-200" />

        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">Órdenes Recientes</h2>

        {isAuthenticated && orders.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-3 justify-center items-center">
            <span className="text-gray-700 font-semibold">Ordenar por:</span>
            {['created_at', 'total', 'id'].map((key) => ( 
              <button
                key={key}
                onClick={() => handleSortChange(key as SortKey)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${sortKey === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
              >
                {key === 'created_at' ? 'Fecha' : key === 'total' ? 'Total' : 'ID'}
                {sortKey === key && (
                  <span className="ml-2">
                    {sortDirection === 'asc' ? '⬆️' : '⬇️'}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {sortedOrders.length === 0 && isAuthenticated ? (
          <p className="text-center text-lg text-gray-600 py-10 bg-blue-50 rounded-lg shadow-inner">
            No hay órdenes para mostrar en este momento.
          </p>
        ) : !isAuthenticated ? (
            <p className="text-center text-lg text-gray-600 py-10 bg-blue-50 rounded-lg shadow-inner">
                Por favor, inicia sesión para ver las órdenes.
            </p>
        ) : (
          <div className="space-y-6">
            {sortedOrders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white border border-blue-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-blue-800">Orden #{order.id}</h2>
                    <p className="text-gray-700">Total: ${parseFloat(order.total).toFixed(2)}</p> {/* Parse total here for display */}
                    <p className="text-gray-600 text-sm">Fecha: {formatDate(order.created_at)}</p>
                  </div>
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {expandedOrderId === order.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                  </button>
                </div>
                {expandedOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <h3 className="text-lg font-bold mb-3 text-blue-700">Productos en esta Orden:</h3>
                    {order.order_items.length === 0 ? (
                      <p className="text-gray-600 italic">No hay productos en esta orden.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-blue-100 rounded-lg shadow-sm">
                          <thead>
                            <tr className="bg-blue-50 text-blue-800 uppercase text-sm leading-normal">
                              <th className="py-3 px-6 text-left">Producto ID</th> 
                              <th className="py-3 px-6 text-center">Cantidad</th>
                              <th className="py-3 px-6 text-right">Precio Unit.</th>
                              <th className="py-3 px-6 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm font-light">
                            {order.order_items.map((item, itemIndex) => (
                              <tr key={item.id || itemIndex} className="border-b border-gray-200 hover:bg-blue-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="font-medium">
                                      ID: {item.product_id}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                  {item.quantity}
                                </td>
                                <td className="py-3 px-6 text-right">
                                  ${parseFloat(item.price_at_time).toFixed(2)} 
                                </td>
                                <td className="py-3 px-6 text-right">
                                  ${(parseFloat(item.price_at_time) * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;