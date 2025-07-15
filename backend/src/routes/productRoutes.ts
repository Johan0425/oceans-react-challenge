import { Router } from 'express';
import { getProducts, createProductHandler } from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';
import express from 'express';


/**
 * Creates a new instance of an Express router.
 * This router is used to define and handle routes for the application.
 *
 * @constant
 */

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Producto A
 *                   price:
 *                     type: number
 *                     example: 100
 *   post:
 *     summary: Crea un nuevo producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Producto A
 *               description:
 *                 type: string
 *                 example: Este es un producto de ejemplo
 *               price:
 *                 type: number
 *                 example: 100
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Producto A
 *                 price:
 *                   type: number
 *                   example: 100
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */

router.get('/', getProducts);
router.post('/', authenticateToken, createProductHandler);

export default router;