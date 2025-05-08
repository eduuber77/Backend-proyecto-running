import { PrismaClient } from '@prisma/client';
import { Participacion } from '../models/participacion';

const prisma = new PrismaClient();
// Servicio de participación

/**
 * Inscribe un usuario a un evento
 */
export const inscribirUsuario = async (userId: number, eventoId: number) => {
  // Verificar que el usuario existe
  const usuario = await prisma.user.findUnique({ where: { id: userId } });
  if (!usuario) {
    throw new Error(`El usuario con ID ${userId} no existe`);
  }
  
  // Verificar que el evento existe
  const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
  if (!evento) {
    throw new Error(`El evento con ID ${eventoId} no existe`);
  }
  
  // Verificar si el usuario ya está inscrito
  const inscripcionExistente = await prisma.participacion.findFirst({
    where: {
      userId,
      eventoId
    }
  });
  
  if (inscripcionExistente) {
    throw new Error(`El usuario ya está inscrito en este evento`);
  }
  
  // Crear la inscripción
  return await prisma.participacion.create({
    data: {
      userId,
      eventoId,
      fechaInscripcion: new Date()
    },
    include: {
      usuario: true,
      evento: true
    }
  });
};

/**
 * Cancela la inscripción de un usuario a un evento
 */
export const cancelarInscripcion = async (userId: number, eventoId: number) => {
  // Verificar que la inscripción existe
  const inscripcion = await prisma.participacion.findFirst({
    where: {
      userId,
      eventoId
    }
  });
  
  if (!inscripcion) {
    return false;
  }
  
  // Eliminar la inscripción
  await prisma.participacion.delete({
    where: {
      id: inscripcion.id
    }
  });
  
  return true;
};

/**
 * Obtiene todas las inscripciones de un usuario
 */
export const getInscripcionesByUsuario = async (userId: number) => {
  // Verificar que el usuario existe
  const usuario = await prisma.user.findUnique({ where: { id: userId } });
  if (!usuario) {
    throw new Error(`El usuario con ID ${userId} no existe`);
  }
  
  return await prisma.participacion.findMany({
    where: {
      userId
    },
    include: {
      evento: true
    }
  });
};

/**
 * Obtiene todas las inscripciones para un evento
 */
export const getInscripcionesByEvento = async (eventoId: number) => {
  // Verificar que el evento existe
  const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
  if (!evento) {
    throw new Error(`El evento con ID ${eventoId} no existe`);
  }
  
  return await prisma.participacion.findMany({
    where: {
      eventoId
    },
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          apellidos: true,
          email: true,
          genero: true,
          nivel: true
        }
      }
    }
  });
};

/**
 * Verifica si un usuario está inscrito en un evento
 */
export const verificarInscripcion = async (userId: number, eventoId: number) => {
  const inscripcion = await prisma.participacion.findFirst({
    where: {
      userId,
      eventoId
    }
  });
  
  return !!inscripcion; // Devuelve true si existe la inscripción, false en caso contrario
};