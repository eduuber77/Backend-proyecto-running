import express from 'express';
import authRouter from './routes/authRouter';
import eventoRouter from './routes/eventoRouter';
import path from 'path';
import cors from "cors";
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import participacionRouter from './routes/participacionRouter';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Detectar entorno
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Obtener orígenes permitidos desde variables de entorno
const allowedOriginsStr = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsStr.split(',').filter(origin => origin.trim() !== '');

// Valor de respaldo si no hay orígenes configurados
const defaultOrigins = ['http://localhost:5173']; //front react

// Configuración CORS
app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins,
  credentials: true, // Importante para permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar rate limiting para evitar ataques DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limitar cada IP a 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde'
});

// Aplicar rate limiting a todas las rutas
app.use(limiter);

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express + TypeScript!');
});

// Definir rutas API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/evento", eventoRouter);
app.use('/api/v1/participaciones', participacionRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT} (${isProduction ? 'producción' : 'desarrollo'})`);
});