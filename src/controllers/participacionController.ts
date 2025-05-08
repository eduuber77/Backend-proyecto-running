// CONTROLADORES DE PARTICIPACIÓN
import { Request, Response } from 'express';
import * as participacionService from '../services/participacionService';

/**
 * Inscribe un usuario a un evento
 */
export const inscribirUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventoId } = req.body;
    
    // Valida que se recibieron ambos IDs
    if (!userId || !eventoId) {
      res.status(400).json({ 
        message: 'Se requiere el ID del usuario y el ID del evento para la inscripción' 
      });
      return;
    }
    
    // Validar que los IDs sean números
    const userIdNum = parseInt(userId, 10);
    const eventoIdNum = parseInt(eventoId, 10);
    
    if (isNaN(userIdNum) || isNaN(eventoIdNum)) {
      res.status(400).json({ message: 'Los IDs deben ser números válidos' });
      return;
    }
    
    // Crea la inscripción
    const participacion = await participacionService.inscribirUsuario(userIdNum, eventoIdNum);
    res.status(201).json({
      message: 'Usuario inscrito correctamente',
      participacion
    });
  } catch (error) {
    // Manejar errores específicos
    if (error instanceof Error && error.message.includes('ya está inscrito')) {
      res.status(409).json({
        message: 'El usuario ya está inscrito en este evento',
        error: error.message
      });
      return;
    }
    
    res.status(500).json({
      message: 'Error al inscribir usuario',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Cancela la inscripción de un usuario a un evento
 */
export const cancelarInscripcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const eventoId = parseInt(req.params.eventoId, 10);
    
    if (isNaN(userId) || isNaN(eventoId)) {
      res.status(400).json({ message: 'Los IDs deben ser números válidos' });
      return;
    }
    
    const cancelado = await participacionService.cancelarInscripcion(userId, eventoId);
    
    if (cancelado) {
      res.json({ message: 'Inscripción cancelada correctamente' });
    } else {
      res.status(404).json({ message: 'No se encontró la inscripción' });
    }
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({
      message: 'Error al cancelar inscripción',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Obtiene todas las inscripciones de un usuario
 */
export const getInscripcionesByUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      res.status(400).json({ message: 'El ID de usuario debe ser un número válido' });
      return;
    }
    
    const inscripciones = await participacionService.getInscripcionesByUsuario(userId);
    res.json(inscripciones);
  } catch (error) {
    console.error('Error al obtener inscripciones del usuario:', error);
    res.status(500).json({
      message: 'Error al obtener inscripciones',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Obtiene todas las inscripciones para un evento
 */
export const getInscripcionesByEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventoId = parseInt(req.params.eventoId, 10);
    
    if (isNaN(eventoId)) {
      res.status(400).json({ message: 'El ID de evento debe ser un número válido' });
      return;
    }
    
    const inscripciones = await participacionService.getInscripcionesByEvento(eventoId);
    res.json(inscripciones);
  } catch (error) {
    console.error('Error al obtener inscripciones del evento:', error);
    res.status(500).json({
      message: 'Error al obtener inscripciones',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};