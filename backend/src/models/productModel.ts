import pool from '../config/db';
import { IProduct } from '../types';

/**
 * Retrieves all products from the database.
 *
 * @returns {Promise<IProduct[]>} A promise that resolves to an array of products.
 * @throws {Error} Throws an error if the query fails.
 */

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw new Error('Failed to fetch products');
  }
};

/**
 * Creates a new product in the database.
 *
 * @param product - The product object containing the details of the product to be created.
 * @param product.name - The name of the product.
 * @param product.description - A brief description of the product.
 * @param product.price - The price of the product.
 * @param product.stock - The stock quantity of the product.
 * @returns A promise that resolves to the created product object.
 * @throws An error if the product creation fails.
 */

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