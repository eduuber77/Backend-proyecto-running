// CONTROLADORES DE EVENTOS
import { Request, Response } from 'express';
import * as eventoService from '../services/eventoService';
import path from 'path';
import fs from 'fs';

// Genera URL relativa para acceso a archivos desde el cliente
const getLocalFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};

// Recupera y devuelve todos los eventos
export const getAllEventos = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventos = await eventoService.getAllEventos();
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      message: 'Error al obtener eventos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Busca y devuelve un evento por su ID
export const getEventoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const evento = await eventoService.getEventoById(id);
    if (evento) {
      res.json(evento);
    } else {
      res.status(404).json({ message: 'Evento no encontrado' });
    }
  } catch (error) {
    console.error(`Error al obtener evento con id ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Error al obtener evento',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Crea un nuevo evento con posibilidad de cargar imagen
export const createEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Iniciando createEvento');
    console.log('Body recibido:', req.body);
    console.log('File recibido:', req.file);
    
    // Verifica si se recibieron datos
    if (!req.body) {
      res.status(400).json({ message: 'No se recibieron datos para el evento' });
      return;
    }
    
    const data = { ...req.body };

    // Convertir fecha de string a Date
    if (data.fecha && typeof data.fecha === 'string') {
      data.fecha = new Date(data.fecha);
    }

    // Establecer destacado como false si no viene definido
    if (data.destacado === undefined) {
      data.destacado = false;
    }

    // Convertir destacado string a boolean
    if (typeof data.destacado === 'string') {
      data.destacado = data.destacado === 'true';
    }

    // Procesar imagen si se envió
    if (req.file) {
      console.log(`Archivo recibido: ${req.file.filename}`);
      // Generar URL local para la imagen
      const imagenUrl = getLocalFileUrl(req.file.filename);
      data.imagenUrl = imagenUrl;
      console.log(`Imagen guardada localmente: ${imagenUrl}`);
    } else {
      console.log('No se recibió ningún archivo');
      data.imagenUrl = ''; // Valor por defecto
    }

    // Crea el evento en la base de datos
    const newEvento = await eventoService.createEvento(data);
    res.status(201).json(newEvento);
  } catch (error) {
    console.error('Error al crear el evento:', error);
    res.status(500).json({
      message: 'Error al crear el evento',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Elimina un evento y su imagen asociada
export const deleteEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // Obtiene el evento para eliminar también su imagen
    const evento = await eventoService.getEventoById(id);
    
    if (evento && evento.imagenUrl) {
      // Extraer el nombre del archivo de la URL
      const filename = evento.imagenUrl.split('/').pop();
      
      if (filename) {
        // Construir la ruta completa del archivo
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        // Verifica y elimina el archivo de imagen
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Imagen eliminada: ${filePath}`);
        }
      }
    }
    
    const deleted = await eventoService.deleteEvento(id);
    if (deleted) {
      res.status(200).json({ message: 'Evento eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Evento no encontrado' });
    }
  } catch (error) {
    console.error(`Error al eliminar evento con id ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Error al eliminar el evento',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// CONTROLADORES PARA FILTRADO Y BÚSQUEDA

// Busca eventos que coincidan con un término en su nombre
export const searchEventosByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchTerm = req.query.nombre as string;
    
    if (!searchTerm) {
      res.status(400).json({ message: 'Se requiere un término de búsqueda' });
      return;
    }
    
    const eventos = await eventoService.searchEventosByName(searchTerm);
    res.json(eventos);
  } catch (error) {
    console.error('Error al buscar eventos por nombre:', error);
    res.status(500).json({
      message: 'Error al buscar eventos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Filtra eventos por su nivel de dificultad
export const filterEventosByDifficulty = async (req: Request, res: Response): Promise<void> => {
  try {
    const dificultad = req.query.nivel as string;
    
    if (!dificultad) {
      res.status(400).json({ message: 'Se requiere un nivel de dificultad' });
      return;
    }
    
    // Validar que el nivel de dificultad sea válido
    const nivelesValidos = ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'];
    if (!nivelesValidos.includes(dificultad.toUpperCase())) {
      res.status(400).json({ 
        message: 'Nivel de dificultad no válido',
        nivelesPermitidos: nivelesValidos
      });
      return;
    }
    
    const eventos = await eventoService.filterEventosByDifficulty(dificultad.toUpperCase());
    res.json(eventos);
  } catch (error) {
    console.error('Error al filtrar eventos por dificultad:', error);
    res.status(500).json({
      message: 'Error al filtrar eventos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Filtra eventos por ciudad
 */
export const filterEventosByCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const ciudad = req.query.ciudad as string;
    
    if (!ciudad) {
      res.status(400).json({ message: 'Se requiere una ciudad' });
      return;
    }
    
    const eventos = await eventoService.filterEventosByCity(ciudad);
    res.json(eventos);
  } catch (error) {
    console.error('Error al filtrar eventos por ciudad:', error);
    res.status(500).json({
      message: 'Error al filtrar eventos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Obtiene eventos ordenados por nombre (ascendente o descendente)
 */
export const getEventosOrderedByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const orden = (req.query.orden as 'asc' | 'desc') || 'asc'; // Por defecto ascendente
    
    // Validar que el orden sea válido
    if (orden !== 'asc' && orden !== 'desc') {
      res.status(400).json({ 
        message: 'Orden no válido',
        ordenesPermitidos: ['asc', 'desc']
      });
      return;
    }
    
    const eventos = await eventoService.getEventosOrderedByName(orden);
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos ordenados:', error);
    res.status(500).json({
      message: 'Error al obtener eventos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Método unificado para filtrar, buscar y ordenar eventos con varios criterios
 */
export const filterAndSearchEventos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      nombre, 
      ciudad, 
      nivelDificultad, 
      destacado,
      orden = 'asc',
      ordenarPor = 'nombre'
    } = req.query;
    
    // Validar nivel de dificultad si se proporciona
    if (nivelDificultad) {
      const nivelesValidos = ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'];
      if (!nivelesValidos.includes(String(nivelDificultad).toUpperCase())) {
        res.status(400).json({ 
          message: 'Nivel de dificultad no válido',
          nivelesPermitidos: nivelesValidos
        });
        return;
      }
    }
    
    // Validar campo de ordenamiento
    const camposOrdenValidos = ['nombre', 'fecha', 'ciudad', 'nivelDificultad'];
    const campoOrden = String(ordenarPor);
    
    if (!camposOrdenValidos.includes(campoOrden)) {
      res.status(400).json({ 
        message: 'Campo de ordenamiento no válido',
        camposPermitidos: camposOrdenValidos
      });
      return;
    }
    
    // Validar dirección de ordenamiento
    if (orden !== 'asc' && orden !== 'desc') {
      res.status(400).json({ 
        message: 'Orden no válido',
        ordenesPermitidos: ['asc', 'desc']
      });
      return;
    }
    
    // Procesar destacado si se proporciona
    let destacadoBool: boolean | undefined = undefined;
    if (destacado === 'true') {
      destacadoBool = true;
    } else if (destacado === 'false') {
      destacadoBool = false;
    }
    
    const eventos = await eventoService.filterAndSearchEventos({
      nombre: nombre as string,
      ciudad: ciudad as string,
      nivelDificultad: nivelDificultad as 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO',
      destacado: destacadoBool,
      ordenarPor: campoOrden,
      orden: orden as 'asc' | 'desc'
    });
    
    res.json(eventos);
  } catch (error) {
    console.error('Error al filtrar y buscar eventos:', error);
    res.status(500).json({
      message: 'Error al filtrar y buscar eventos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Obtiene las opciones de filtrado disponibles (ciudades y niveles)
 */
export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const [nivelesDificultad, ciudades] = await Promise.all([
      eventoService.getAllDifficultyLevels(),
      eventoService.getAllCities()
    ]);
    
    res.json({
      nivelesDificultad,
      ciudades
    });
  } catch (error) {
    console.error('Error al obtener opciones de filtrado:', error);
    res.status(500).json({
      message: 'Error al obtener opciones de filtrado',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Obtiene eventos próximos (con fecha posterior a la actual)
export const getProximosEventos = async (req: Request, res: Response): Promise<void> => {
  try {
    const cantidad = parseInt(req.query.cantidad as string, 10) || 6; // Por defecto 6 eventos
    
    const eventos = await eventoService.getProximosEventos(cantidad);
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener próximos eventos:', error);
    res.status(500).json({
      message: 'Error al obtener próximos eventos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};