import { Request, Response } from 'express';
import { createOrder, getAllOrdersWithDetails } from '../models/orderModel';
import { IOrder, IOrderItem } from '../types';

/**
 * Handles the creation of a new order.
 *
 * This function processes the incoming request to create an order for the authenticated user.
 * It validates the order items, ensures they meet the required criteria, and then creates the order
 * in the database. If successful, it responds with the created order; otherwise, it returns an error response.
 *
 * @param req - The HTTP request object, expected to contain the authenticated user's ID and order items in the body.
 * @param res - The HTTP response object used to send back the appropriate response.
 *
 * @throws {Error} If there is an issue during order creation, a 500 status code is returned with the error message.
 *
 * @returns A JSON response with the created order on success or an error message on failure.
 */

export const createOrderHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // From authMiddleware
    const { orderItems } = req.body as { orderItems: IOrderItem[] };

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const validItems = orderItems.map(item => ({
      id: item.id || 0, // Default or generate an ID if necessary
      order_id: item.order_id || 0, // Default or associate with an order ID
      product_id: item.product_id,
      quantity: item.quantity || 1,
      price_at_time: item.price_at_time || 0,
    })).filter(item => item.quantity > 0 && item.price_at_time >= 0);

    if (validItems.length !== orderItems.length) {
      return res.status(400).json({ message: 'Invalid order item data' });
    }

    const order = await createOrder(userId, validItems);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: (error as Error).message });
  }
};

/**
 * Retrieves all orders with their details for the authenticated user.
 *
 * @param req - The HTTP request object, which includes the authenticated user's ID in `req.user.id`.
 * @param res - The HTTP response object used to send the response back to the client.
 * 
 * @remarks
 * This function assumes that the `authMiddleware` has been applied to the route,
 * and that it attaches the authenticated user's ID to the `req.user` object.
 *
 * @throws Will return a 500 status code with an error message if an error occurs while fetching orders.
 */
export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // From authMiddleware
    const orders = await getAllOrdersWithDetails(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: (error as Error).message });
  }
};