import type{ Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User ,{type IUser} from '../models/Users.js';

// 1. Ahora sí, extendemos del Request de Express
export interface AuthRequest extends Request {
  user?: IUser; 
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  // 2. Hacemos el casting usando unknown como sugirió el error para mayor seguridad
  // Pero con la importación correcta de express, esto ya no debería dar error
  const authReq = (req as unknown) as AuthRequest;

  let token: string | undefined;

  if (
    authReq.headers.authorization &&
    authReq.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = authReq.headers.authorization.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido' });
      }
      
      const secret = process.env.JWT_SECRET || 'secreto_temporal';
      const decoded: any = jwt.verify(token, secret);

      // Buscamos al usuario
      authReq.user = await User.findById(decoded.id).select('-passwordHash');

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};