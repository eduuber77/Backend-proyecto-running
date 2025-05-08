import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// Clave secreta para firmar tokens
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_muy_segura';
const JWT_EXPIRES_IN = '7d'; // Token expira en 7 días

// Define la estructura del payload JWT
export interface UserPayload {
  id: number;
  email: string;
  tipoUsuario: string;
}

// Genera un token JWT con los datos del usuario
export const generateToken = (user: User): string => {
  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    tipoUsuario: user.tipoUsuario
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verifica y decodifica un token JWT
export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
};