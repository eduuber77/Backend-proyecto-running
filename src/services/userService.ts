import { User } from "@prisma/client";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10; // Número de rondas para el algoritmo de hash

// Obtiene todos los usuarios 
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: { participaciones: true },
  });
};

// Crea un nuevo usuario con contraseña encriptada
export const createUser = async (data: Omit<User, "id" | "createdAt" | "updatedAt">) => {
   // Hashea la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

// Busca un usuario por su email
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Obtiene un usuario por ID
export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { 
      participaciones: {
        include: {
          evento: true
        }
      }
    },
  });
};