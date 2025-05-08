import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserPayload } from '../utils/jwtUtils';

// MIDDLEWARE DE AUTENTICACIÓN

// Extiende el tipo Request para incluir información del usuario
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Middleware que verifica el token JWT y añade información del usuario al request
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {

    // Obtiene token de cookie o header de autorización
  const tokenFromCookie = req.cookies?.token;
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  const token = tokenFromCookie || tokenFromHeader;

  // Verifica si se proporcionó un token
  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. No se proporcionó token de autenticación.' });
    return;
  }

  // Verifica validez del token
  const user = verifyToken(token);
  
  if (!user) {
    res.status(403).json({ message: 'Token inválido o expirado.' });
    return;
  }

  req.user = user;
  next();
};