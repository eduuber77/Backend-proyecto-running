import { Router } from 'express';
import * as participacionController from '../controllers/participacionController';

// Rutas de participación
const participacionRouter = Router();

// Ruta para inscribir un usuario a un evento
participacionRouter.post('/inscribir', participacionController.inscribirUsuario);

// Ruta para cancelar inscripción
participacionRouter.delete('/:userId/:eventoId', participacionController.cancelarInscripcion);

// Ruta para obtener inscripciones de un usuario
participacionRouter.get('/usuario/:userId', participacionController.getInscripcionesByUsuario);

// Ruta para obtener inscripciones de un evento
participacionRouter.get('/evento/:eventoId', participacionController.getInscripcionesByEvento);

export default participacionRouter;