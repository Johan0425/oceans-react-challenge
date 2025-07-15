/**
 * This is the main entry point for the backend application.
 * It initializes the Express application, sets up middleware, routes, and error handling,
 * and starts the server on the specified port.
 * 
 * Environment Variables:
 * - `PORT`: The port number on which the server will listen for incoming requests (default: 3000).
 * - `FRONTEND_URL`: The URL of the frontend application for CORS configuration.
 * - `DB_USER`: The database username.
 * - `DB_HOST`: The database host.
 * - `DB_DATABASE`: The database name.
 * - `DB_PASSWORD`: The database password.
 * - `DB_PORT`: The database port.
 * 
 * Middleware:
 * - `cors`: Configures Cross-Origin Resource Sharing (CORS) to allow requests from the frontend.
 * - `express.json`: Parses incoming JSON requests.
 * - `express.urlencoded`: Parses URL-encoded data.
 * 
 * Routes:
 * - `/health`: Health check endpoint to verify server and database connectivity.
 * - `/`: Root endpoint returning a basic status response.
 * - `/api-docs`: Serves Swagger UI for API documentation.
 * - `/auth`: Authentication-related routes.
 * - `/products`: Product-related routes.
 * - `/orders`: Order-related routes.
 * 
 * Error Handling:
 * - Custom error handler middleware to handle application errors.
 * 
 * Database:
 * - Establishes a connection to the database using the `pool` object.
 * - Logs database connection status.
 * 
 * Swagger:
 * - Serves API documentation using Swagger UI at `/api-docs`.
 * 
 * Server:
 * - Starts the server and listens on the specified port.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pool from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/health', (req: Request, res: Response) => {
  pool.query('SELECT 1')
    .then(() => res.json({
      status: 'OK',
      database: 'connected'
    }))
    .catch(err => res.status(500).json({
      status: 'Unhealthy',
      database: 'disconnected',
      error: err.message
    }));
});

console.log('DB Config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool.connect((err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Database connected successfully');
});

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log('Swagger UI available at /api-docs');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
console.log('Routes loaded:', [
  ...authRoutes.stack.map(r => r.route?.path).filter(path => path !== undefined),
  ...productRoutes.stack.map(r => r.route?.path).filter(path => path !== undefined),
  ...orderRoutes.stack.map(r => r.route?.path).filter(path => path !== undefined),
]);

app.use(errorHandler);

/**
 * The port number on which the server will listen for incoming requests.
 * Defaults to 3000 if the `PORT` environment variable is not defined.
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});