import { Request, Response } from 'express';
import { createOrder, getAllOrdersWithDetails } from '../models/orderModel';
import { IOrder, IOrderItem } from '../types';

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

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // From authMiddleware
    const orders = await getAllOrdersWithDetails(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: (error as Error).message });
  }
};