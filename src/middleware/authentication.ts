import { Request,Response,NextFunction } from "express";
//import {RequestWithUser} from "../Interfaces/requestWithUser";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    userId: string;
  }
 
export const authMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
    // Get the JWT token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
     const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
      req.user = { id: decodedToken.userId };   
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(403).json({ message: 'Unauthorized' });
    }
  };