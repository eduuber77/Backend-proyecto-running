// src/services/eventoService.ts
import { PrismaClient } from '@prisma/client';
import { Evento } from '../models/evento';

const prisma = new PrismaClient();

// Servicio de eventos

/**
 * Recupera todos los eventos con sus participantes
 */
export const getAllEventos = async () => {
  return await prisma.evento.findMany({
    include: {
      participantes: true
    }
  });
};

/**
 * Obtiene un evento por su ID
 */
export const getEventoById = async (id: number) => {
  return await prisma.evento.findUnique({
    where: { id },
    include: {
      participantes: true
    }
  });
};

/**
 * Crea un nuevo evento
 */
export const createEvento = async (data: Partial<Evento>) => {
  // Asegurar que todos los campos requeridos estén presentes
  if (!data.nombre || !data.ciudad || !data.fecha || !data.nivelDificultad) {
    throw new Error('Faltan campos requeridos para crear el evento');
  }
  
  // Maneja explícitamente la URL de imagen
  const imagenUrlToSave = data.imagenUrl || ""; 
  console.log('URL de imagen a guardar:', imagenUrlToSave);
  
  try {
    // Crea registro en la base de datos
    const evento = await prisma.evento.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        ciudad: data.ciudad,
        fecha: data.fecha,
        nivelDificultad: data.nivelDificultad,
        destacado: data.destacado || false,
        imagenUrl: imagenUrlToSave 
      }
    });
    
    console.log('Evento creado en DB:', evento);
    return evento;
  } catch (error) {
    console.error('Error al crear evento:', error);
    throw error;
  }
};

/**
 * Actualiza un evento existente
 */
export const updateEvento = async (id: number, data: Partial<Evento>) => {
  // Verificar que el evento existe
  const evento = await prisma.evento.findUnique({ where: { id } });
  if (!evento) {
    return null;
  }
  
   // Actualizar los campos proporcionados
  return await prisma.evento.update({
    where: { id },
    data: {
      ...(data.nombre && { nombre: data.nombre }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
      ...(data.ciudad && { ciudad: data.ciudad }),
      ...(data.fecha && { fecha: data.fecha }),
      ...(data.nivelDificultad && { nivelDificultad: data.nivelDificultad }),
      ...(data.destacado !== undefined && { destacado: data.destacado }),
      ...(data.imagenUrl !== undefined && { imagenUrl: data.imagenUrl })
    }
  });
};

/**
 * Elimina un evento por su ID
 */
export const deleteEvento = async (id: number) => {
  // Verificar que el evento existe
  const evento = await prisma.evento.findUnique({ where: { id } });
  if (!evento) {
    return false;
  }
  
  await prisma.evento.delete({ where: { id } });
  return true;
};

/**
 * Busca eventos cuyo nombre contenga el término de búsqueda
 */
export const searchEventosByName = async (nombre: string) => {
  return await prisma.evento.findMany({
    where: {
      nombre: {
        contains: nombre
      }
    },
    include: {
      participantes: true
    }
  });
};

/**
 * Filtra eventos por nivel de dificultad
 */
export const filterEventosByDifficulty = async (nivelDificultad: string) => {
  return await prisma.evento.findMany({
    where: {
      nivelDificultad: nivelDificultad as 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'
    },
    include: {
      participantes: true
    }
  });
};

/**
 * Filtra eventos por ciudad
 */
export const filterEventosByCity = async (ciudad: string) => {
  return await prisma.evento.findMany({
    where: {
      ciudad: {
        contains: ciudad
      }
    },
    include: {
      participantes: true
    }
  });
};

/**
 * Obtiene eventos ordenados por nombre
 */
export const getEventosOrderedByName = async (orden: 'asc' | 'desc' = 'asc') => {
  return await prisma.evento.findMany({
    orderBy: {
      nombre: orden
    },
    include: {
      participantes: true
    }
  });
};

/**
 * Filtra y busca eventos con múltiples criterios
 */
export const filterAndSearchEventos = async (params: {
  nombre?: string;
  ciudad?: string;
  nivelDificultad?: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  destacado?: boolean;
  ordenarPor?: string;
  orden?: 'asc' | 'desc';
}) => {
  const { 
    nombre, 
    ciudad, 
    nivelDificultad, 
    destacado,
    ordenarPor = 'nombre',
    orden = 'asc'
  } = params;
  
  // Construye objeto para filtrado en prisma
  const where: any = {};
  
  if (nombre) {
    where.nombre = {
      contains: nombre
    };
  }
  
  if (ciudad) {
    where.ciudad = {
      contains: ciudad
    };
  }
  
  if (nivelDificultad) {
    where.nivelDificultad = nivelDificultad;
  }
  
  if (destacado !== undefined) {
    where.destacado = destacado;
  }
  
  // Validar campo de ordenamiento
  const camposOrdenValidos = ['nombre', 'fecha', 'ciudad', 'nivelDificultad'];
  const campoOrden = camposOrdenValidos.includes(ordenarPor) ? ordenarPor : 'nombre';
  
  // Construir el objeto orderBy
  const orderBy: any = {};
  orderBy[campoOrden] = orden;
  
  // Ejecuta consulta con todos los criterios
  return await prisma.evento.findMany({
    where,
    orderBy,
    include: {
      participantes: true
    }
  });
};

/**
 * Obtiene todos los niveles de dificultad disponibles
 */
export const getAllDifficultyLevels = async () => {
  const results = await prisma.evento.findMany({
    select: {
      nivelDificultad: true
    },
    distinct: ['nivelDificultad']
  });
  
  return results.map(result => result.nivelDificultad);
};

/**
 * Obtiene todas las ciudades disponibles
 */
export const getAllCities = async () => {
  const results = await prisma.evento.findMany({
    select: {
      ciudad: true
    },
    distinct: ['ciudad']
  });
  
  return results.map(result => result.ciudad);
};


export const getProximosEventos = async (cantidad: number = 6) => {
  // Obtener fecha actual
  const fechaActual = new Date();
  
  return await prisma.evento.findMany({
    where: {
      fecha: {
        gte: fechaActual // Solo eventos con fecha mayor o igual a la actual
      }
    },
    orderBy: {
      fecha: 'asc' // Ordenar por fecha ascendente (primero los más próximos)
    },
    take: cantidad, // Limitar a la cantidad especificada
    include: {
      participantes: true
    }
  });
};