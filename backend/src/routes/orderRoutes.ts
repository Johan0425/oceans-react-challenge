import { Router } from 'express';
import { createOrderHandler, getOrders } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

/**
 * Creates an instance of an Express router to define and handle
 * order-related routes for the application.
 *
 * @constant
 * @type {Router}
 */

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *       401:
 *         description: Unauthorized
 */


router.post('/', authenticateToken, createOrderHandler);
router.get('/', authenticateToken, getOrders);

export default router;