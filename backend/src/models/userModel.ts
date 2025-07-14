import pool from '../config/db';
import bcrypt from 'bcryptjs';

pool.connect((err) => {
    if (err) {
      console.error('Initial database connection error:', {
        message: err.message,
        code: (err as any).code,
        password: process.env.DB_PASSWORD?.toString() || 'undefined',
      });
    } else {
      console.log('Database connected successfully');
    }
  });
  
  pool.on('error', (err, client) => {
    console.error('Pool error:', {
      message: err.message,
      client: client ? 'active' : 'inactive',
    });
  });

export const findUserByUsername = async (username: string) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in findUserByUsername:', error);
    throw new Error('Database query failed');
  }
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Password and hashed password are required');
    }
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error in comparePassword:', error);
    throw error;
  }
};

export const createUser = async (username: string, password: string, role: string = 'waiter') => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
  
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const result = await client.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, hashedPassword, role]
      );
  
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createUser:', error);
  
      if ((error as any).code === '23505') {
        throw new Error('Username already exists');
      }
      throw new Error('User creation failed');
    } finally {
      client.release();
    }
  };