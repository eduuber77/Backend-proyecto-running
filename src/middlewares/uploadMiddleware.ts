import multer from "multer";
import path from "path";
import fs from "fs";

// MIDDLEWARE DE UPLOAD DE ARCHIVOS

// Asegurar que la carpeta uploads existe con permisos correctos
const uploadDir = path.join(process.cwd(), 'uploads');
console.log(`Directorio de uploads: ${uploadDir}`);

if (!fs.existsSync(uploadDir)) {
  try {
    // Crea directorio si no existe
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Directorio de uploads creado: ${uploadDir}`);
    // Establece permisos de lectura/escritura
    fs.chmodSync(uploadDir, 0o755);
  } catch (error) {
    console.error(`Error al crear directorio de uploads: ${error}`);
    throw new Error(`No se pudo crear el directorio de uploads: ${error}`);
  }
}

// Configura almacenamiento para archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Establece directorio destino
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Genera nombre único con timestamp para evitar colisiones
    const timestamp = Date.now();
    const nombreArchivo = `${timestamp}_${file.originalname.replace(/\s+/g, '_')}`;
    console.log(`Nombre de archivo generado: ${nombreArchivo}`);
    cb(null, nombreArchivo);
  }
});


// Filtro para permitir solo tipos de imagen válidos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  console.log(`Verificando tipo de archivo: ${file.mimetype}`);
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido. Solo se permiten: ${allowedMimeTypes.join(', ')}`) as any);
  }
};

// Exportar middleware configurado
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});