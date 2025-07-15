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

/**
 * Finds a user in the database by their username.
 *
 * @param username - The username of the user to search for.
 * @returns A promise that resolves to the user object if found, or `undefined` if no user is found.
 * @throws An error if the database query fails.
 */

export const findUserByUsername = async (username: string) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in findUserByUsername:', error);
    throw new Error('Database query failed');
  }
};

/**
 * Compares a plain text password with a hashed password to determine if they match.
 *
 * @param password - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the passwords match.
 * @throws An error if either the password or hashed password is not provided, or if an error occurs during comparison.
 */

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

/**
 * Creates a new user in the database with the specified username, password, and role.
 * 
 * @param username - The username of the new user. This field is required.
 * @param password - The password of the new user. Must be at least 8 characters long.
 * @param role - The role of the new user. Defaults to 'waiter' if not provided.
 * @returns A promise that resolves to an object containing the created user's id, username, and role.
 * 
 * @throws Will throw an error if the username or password is not provided.
 * @throws Will throw an error if the password is less than 8 characters long.
 * @throws Will throw an error if the username already exists in the database (error code '23505').
 * @throws Will throw a generic error if user creation fails for any other reason.
 */

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