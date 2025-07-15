import { Request, Response } from 'express';
import { getAllProducts, createProduct } from '../models/productModel';
import { IProduct } from '../types';

/**
 * Handles the request to fetch all products.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A JSON response containing the list of products or an error message.
 *
 * @throws Returns a 500 status code with an error message if fetching products fails.
 */

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
  }
};

/**
 * Handles the creation of a new product.
 *
 * @param req - The HTTP request object, containing the product data in the body.
 * @param res - The HTTP response object used to send the response.
 *
 * @remarks
 * This function validates the product data from the request body, ensuring that
 * the `name` is provided, and `price` and `stock` are numbers greater than or equal to 0.
 * If the validation passes, it creates a new product using the `createProduct` function
 * and returns the created product with a 201 status code.
 * If validation fails, it responds with a 400 status code and an error message.
 * If an unexpected error occurs, it responds with a 500 status code and the error details.
 *
 * @throws {Error} If an unexpected error occurs during product creation.
 *
 * @returns A JSON response containing the newly created product or an error message.
 */

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock } = req.body as IProduct;

    if (!name || typeof price !== 'number' || typeof stock !== 'number' || price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const product: IProduct = {name, description, price, stock };
    const newProduct = await createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: (error as Error).message });
  }
};