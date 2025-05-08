import { Participacion } from "./participacion";

export interface User {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    genero?: string;
    tipoUsuario: 'ESTANDAR' | 'CORREDOR';
    nivel: number;
    participaciones?: Participacion[];
    createdAt: Date;
    updatedAt: Date;
  }
  