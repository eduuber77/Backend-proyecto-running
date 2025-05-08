import { Evento, User } from "@prisma/client";

export interface Participacion {
    id: number;
    userId: number;
    eventoId: number;
    usuario?: User;
    evento?: Evento;
    fechaInscripcion: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  