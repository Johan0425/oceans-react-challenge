import { Pool } from 'pg';
import dotenv from 'dotenv'; // Load dotenv here too for robustness
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  // Ensure password is treated as string, though process.env usually handles it
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

pool.connect((err) => {
  if (err) {
    console.error('Initial database connection error:', {
      message: err.message,
      code: (err as any).code,
      // Only log password as 'defined'/'undefined' for security
      password_status: process.env.DB_PASSWORD ? 'defined' : 'undefined',
    });
  } else {
    console.log('Database connected successfully');
  }
});

pool.on('error', (err, client) => {
  console.error('Pool error (unhandled client error):', {
    message: err.message,
    client: client ? 'active' : 'inactive',
  });
});

export default pool;

console.log('DB Config:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });