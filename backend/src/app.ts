import dotenv from 'dotenv';
dotenv.config({path: '../.env'}); // Load environment variables from .env file

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pool from './config/db';
import authRoutes from './routes/authRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Añade esto después de express.json()
app.use(express.urlencoded({ extended: true }));

// Mejor manejo de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta de health check mejorada
app.get('/health', (req, res) => {
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

// PostgreSQL Connection

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

// Auth Routes
app.use('/auth', authRoutes);
console.log('Routes loaded:', authRoutes.stack.map(r => r.route?.path).filter(path => path !== undefined));

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});