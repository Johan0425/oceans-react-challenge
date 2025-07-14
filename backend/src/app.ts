import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Load environment variables from .env file

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pool from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middleware/errorHandler';

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

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Auth, Product, and Order Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
console.log('Routes loaded:', [
  ...authRoutes.stack.map(r => r.route?.path).filter(path => path !== undefined),
  ...productRoutes.stack.map(r => r.route?.path).filter(path => path !== undefined),
  ...orderRoutes.stack.map(r => r.route?.path).filter(path => path !== undefined),
]);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});