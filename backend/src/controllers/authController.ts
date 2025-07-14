import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByUsername, comparePassword, createUser } from '../models/userModel';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'zRUu2DEQJg5MMCi81y48ITM6HL4SJlR+4XkmJrEMB3g=';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env');
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    console.log('Register request body:', req.body);
  
    try {
      if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      if (password.length < 8) {
        console.log('Password too short:', password.length);
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
  
      console.log('Checking existing user...');
      const existingUser = await findUserByUsername(username);
      
      if (existingUser) {
        console.log('Username already exists:', username);
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      console.log('Creating new user...');
      const user = await createUser(username, password);
      
      if (!user) {
        console.error('User creation failed');
        return res.status(500).json({ message: 'User creation failed' });
      }
  
      console.log('Generating token...');
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      
      console.log('Registration successful for user:', username);
      res.status(201).json({ token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };