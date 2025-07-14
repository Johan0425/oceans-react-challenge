import { Request, Response, NextFunction } from 'express';
   import jwt, { JwtPayload } from 'jsonwebtoken';

   interface UserPayload extends JwtPayload {
     id: number;
     username: string;
   }

   const JWT_SECRET = process.env.JWT_SECRET || 'zRUu2DEQJg5MMCi81y48ITM6HL4SJlR+4XkmJrEMB3g=';

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