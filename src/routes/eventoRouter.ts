// src/routes/eventoRouter.ts
import { Router } from 'express';
import * as eventoController from '../controllers/eventoController';
import { upload } from '../middlewares/uploadMiddleware';

const eventoRouter = Router();

// Ruta para obtener todos los eventos
eventoRouter.get('/', eventoController.getAllEventos);

// Rutas para búsqueda y filtrado
eventoRouter.get('/proximos', eventoController.getProximosEventos);
eventoRouter.get('/filtros/opciones', eventoController.getFilterOptions);
eventoRouter.get('/buscar/nombre', eventoController.searchEventosByName);
eventoRouter.get('/filtrar/dificultad', eventoController.filterEventosByDifficulty);
eventoRouter.get('/filtrar/ciudad', eventoController.filterEventosByCity);
eventoRouter.get('/ordenar/nombre', eventoController.getEventosOrderedByName);
eventoRouter.get('/buscar', eventoController.filterAndSearchEventos);


eventoRouter.get('/:id', eventoController.getEventoById);

// Rutas para crear y eliminar eventos
eventoRouter.post('/', upload.single('imagenUrl'), eventoController.createEvento);
eventoRouter.delete('/:id', eventoController.deleteEvento);

export default eventoRouter;