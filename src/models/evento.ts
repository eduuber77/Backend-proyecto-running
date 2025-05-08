import { Participacion } from "@prisma/client";

// DEFINICIÓN DE INTERFACES (MODELOS)

export interface Evento {
    id: number;
    nombre: string;
    descripcion?: string;
    ciudad: string;
    fecha: Date;
    nivelDificultad: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
    imagenUrl: string;
    destacado: boolean;
    participantes?: Participacion[];
    createdAt: Date;
    updatedAt: Date;
  }
  