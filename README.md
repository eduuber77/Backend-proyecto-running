# API REST (proyecto Running)

API REST para gestión de eventos de carreras e inscripciones de usuarios, desarrollada con Node.js, Express, TypeScript y MySQL.


🚀 Características principales
------------------------------

*   **ORM PRISMA**:
    *   Gestión de base de datos SQL
*   **Express**:
    *   Framework web rápido y minimalista para Node.js
*   **TypeScript**:
    *   Desarrollo escalable con tipado estático
*   **Autenticación JWT**:
    *   Sistema seguro de registro e inicio de sesión
*   **MySQL**:
    *   Base de datos relacional para almacenamiento persistente
*   **API RESTful**:
    *   Endpoints bien estructurados siguiendo principios REST

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/eduuber77/Backend-proyecto-running.git
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env basado en el ejemplo
    .env
   ```

4. **Configurar la base de datos**
   ```bash
   # Ejecutar migraciones de Prisma
   npx prisma migrate dev
   ```

5. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm run build
   npm start
   ```

## 🔧 Variables de entorno

Crea un archivo `.env` con las siguientes variables:

```env
# Database
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/running_db"

# JWT
JWT_SECRET="tu_clave_secreta_jwt"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS="http://localhost:5173,https://tu-frontend.com"
```


