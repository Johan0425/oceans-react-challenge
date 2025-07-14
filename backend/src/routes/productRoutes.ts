import { Router } from 'express';
import { getProducts, createProductHandler } from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticateToken, createProductHandler);

export default router;