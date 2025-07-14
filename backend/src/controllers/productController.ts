import { Request, Response } from 'express';
import { getAllProducts, createProduct } from '../models/productModel';
import { IProduct } from '../types';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
  }
};

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