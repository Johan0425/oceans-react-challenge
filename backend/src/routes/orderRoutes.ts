import { Router } from 'express';
import { createOrderHandler, getOrders } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createOrderHandler);
router.get('/', authenticateToken, getOrders);

export default router;