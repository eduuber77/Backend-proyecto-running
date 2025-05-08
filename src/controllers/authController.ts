// CONTROLADORES DE AUTENTICACIÓN
import { Request, Response } from "express";
import * as userService from "../services/userService";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtUtils";


// Recupera y devuelve todos los usuarios del sistema
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await userService.getAllUsers();
  res.json(users);
};

// Crea un nuevo usuario, genera token JWT y configura cookie segura 
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    
    // Genera token JWT para autenticación
    const token = generateToken(newUser);
    
    // Configura cookie segura para almacenar el token
    res.cookie('token', token, {
      httpOnly: true, // Evita acceso desde JavaScript del cliente
      secure: process.env.NODE_ENV === 'production', // HTTPS solo en producción
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
      sameSite: 'strict' // Previene ataques CSRF
    });
    
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// Valida credenciales, genera token y establece cookie para inicio de sesión
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  try {
    const user = await userService.getUserByEmail(email);
    
    // Verifica si existe el usuario
    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }
    
    // Compara contraseña con hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }
    
    // Genera token JWT para la sesión
    const token = generateToken(user);
    
    // Configura cookie segura con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS solo en producción
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
      sameSite: 'strict'
    });
    
    // Retorna datos de usuario
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login exitoso",
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Obtiene información del usuario actual autenticado
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }
    
    // Obtiene datos completos del usuario desde la base de datos
    const user = await userService.getUserById(req.user.id);
    
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    
    // Retornar usuario sin el campo password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos del usuario", error });
  }
};

// Cierra sesión eliminando la cookie con el token
export const logoutUser = (req: Request, res: Response): void => {
  // Elimina la cookie que contiene el token
  res.clearCookie('token');
  res.status(200).json({ message: "Sesión cerrada correctamente" });
};