import { Request, Response, NextFunction } from 'express';
   import jwt, { JwtPayload } from 'jsonwebtoken';

   interface UserPayload extends JwtPayload {
     id: number;
     username: string;
   }

   const JWT_SECRET = process.env.JWT_SECRET || 'zRUu2DEQJg5MMCi81y48ITM6HL4SJlR+4XkmJrEMB3g=';

  /**
   * Middleware to authenticate a JSON Web Token (JWT) from the request's `Authorization` header.
   * 
   * This function checks for the presence of a Bearer token in the `Authorization` header,
   * verifies its validity, and attaches the decoded payload to the `req.user` property if valid.
   * 
   * @param req - The incoming HTTP request object.
   * @param res - The outgoing HTTP response object.
   * @param next - The next middleware function in the stack.
   * 
   * @throws {401} If the `Authorization` header is missing or does not start with "Bearer ".
   * @throws {403} If the token is invalid, expired, or the payload is malformed.
   * 
   * Example of a valid `Authorization` header:
   * ```
   * Authorization: Bearer <token>
   * ```
   */
  
   export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
     const authHeader = req.headers['authorization'];

     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ message: 'No token or invalid format' });
     }

     const token = authHeader.split(' ')[1];

     jwt.verify(token, JWT_SECRET, (err, decoded) => {
       if (err) {
         console.error('Token verification error:', err.message);
         return res.status(403).json({ message: 'Invalid or expired token' });
       }

       if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
         return res.status(403).json({ message: 'Invalid token payload' });
       }

       (req as Request & { user: UserPayload }).user = decoded as UserPayload;
       next();
     });
   };