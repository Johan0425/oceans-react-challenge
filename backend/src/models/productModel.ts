import pool from '../config/db';
import { IProduct } from '../types';

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw new Error('Failed to fetch products');
  }
};

export const createProduct = async (product: IProduct): Promise<IProduct> => {
  try {
    const { name, description, price, stock } = product;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stock]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw new Error('Failed to create product');
  }
};