import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function for handling errors in the application.
 *
 * @param err - The error object that was thrown.
 * @param req - The incoming HTTP request object.
 * @param res - The outgoing HTTP response object.
 * @param next - The next middleware function in the stack.
 *
 * Logs the error stack to the console and sends a generic 500 Internal Server Error
 * response with a JSON message indicating that something went wrong.
 */

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};