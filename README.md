# 🌱 Plant Guide - Guía de Plantas para el Hogar

> Plataforma web interactiva que ayuda a las personas a elegir, cuidar y gestionar sus plantas ideales según su hogar y estilo de vida.

![Node.js](https://img.shields.io/badge/Node.js-v22.16.0-green)
![Express](https://img.shields.io/badge/Express-v4.18.2-blue)
![React](https://img.shields.io/badge/React-v19.2.0-cyan)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Express-red)
![MongoDB](https://img.shields.io/badge/MongoDB-v8.0-green)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
  - [1. Clonar el Repositorio](#1-clonar-el-repositorio)
  - [2. Configurar SQL Server](#2-configurar-sql-server)
  - [3. Configurar MongoDB](#3-configurar-mongodb)
  - [4. Configurar Backend](#4-configurar-backend)
  - [5. Configurar Frontend](#5-configurar-frontend)
- [Uso](#-uso)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Crear Usuario Administrador](#-crear-usuario-administrador)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

### Para Usuarios
- 🔐 **Autenticación segura** con JWT
- 📝 **Encuesta personalizada** para conocer tus necesidades
- 🎯 **Recomendaciones inteligentes** basadas en tus respuestas
- 🌿 **Catálogo de plantas** con información detallada
- ⭐ **Sistema de favoritos** para guardar tus plantas preferidas
- 📊 **Estadísticas personales** de tus favoritos

### Para Administradores
- 👥 **Gestión de usuarios** (listar, cambiar roles, activar/desactivar)
- 🌱 **CRUD completo de plantas** (crear, editar, eliminar)
- 📈 **Dashboard con estadísticas** del sistema
- 🔧 **Panel de administración** completo

---
## 👥 Roles y Permisos

El sistema maneja control de acceso basado en roles:

### Usuario
- Registrarse e iniciar sesión
- Completar encuesta de preferencias
- Recibir recomendaciones personalizadas
- Visualizar catálogo de plantas
- Guardar y gestionar plantas favoritas

### Administrador
- Gestionar usuarios (roles, estado)
- Crear, editar y eliminar plantas
- Administrar reglas de recomendación
- Acceder al panel administrativo

### Sistema
- Validar credenciales
- Procesar encuestas
- Generar recomendaciones automáticas
- Controlar permisos de acceso

---

## 📌 Casos de Uso Principales

- CU01: Registro de usuario
- CU02: Inicio de sesión
- CU03: Completar encuesta de preferencias
- CU04: Recibir recomendaciones de plantas
- CU05: Ver catálogo de plantas
- CU06: Guardar plantas favoritas
- CU07: Gestión de plantas (Administrador)
- CU08: Gestión de usuarios (Administrador)


---

## 🛠️ Tecnologías

### Backend
- **Node.js** v22.16.0
- **Express.js** - Framework web
- **SQL Server** - Base de datos para usuarios y encuestas
- **MongoDB** - Base de datos para plantas, favoritos y recomendaciones
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **mssql** - Driver para SQL Server
- **Mongoose** - ODM para MongoDB

### Frontend
- **React** v19.2.0
- **Vite** - Build tool
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **DaisyUI** - Componentes UI
- **Axios** - Cliente HTTP
- **React Icons** - Iconos

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                   │
│  Landing │ Auth │ Survey │ Plants │ Favorites │ Admin  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTP/REST API
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    BACKEND (Express)                    │
│  Auth │ Survey │ Plants │ Recommendations │ Favorites  │
└───────┬─────────────────────┬───────────────────────────┘
        │                     │
        │                     │
┌───────▼────────┐    ┌───────▼────────┐
│   SQL Server   │    │    MongoDB     │
│                │    │                │
│ - Users        │    │ - Plants       │
│ - Surveys      │    │ - Favorites    │
│                │    │ - Recommend.   │
└────────────────┘    └────────────────┘
```

**Separación de datos:**
- **SQL Server**: Usuarios, Autenticación, Encuestas (datos estructurados y críticos)
- **MongoDB**: Plantas, Favoritos, Recomendaciones (datos flexibles y documentos)

---

## 📐 Diagramas UML

El proyecto cuenta con los siguientes diagramas:
- Diagrama de Casos de Uso
- Diagrama de Arquitectura
- Diagrama Entidad–Relación
- Diagrama de Componentes

Estos diagramas forman parte de la documentación técnica del sistema.


---

## 🚧 Estado del Proyecto

El proyecto se encuentra en desarrollo activo.

### Funcionalidades implementadas
- Autenticación y control de roles
- Encuesta de preferencias
- Recomendaciones inteligentes
- Catálogo de plantas
- Panel administrativo

### Funcionalidades en mejora
- Optimización del motor de recomendaciones
- Mejoras de experiencia de usuario


---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Software Requerido

1. **Node.js v22.16.0 o superior**
   - Descargar: https://nodejs.org/
   - Verificar instalación: `node -v`

2. **SQL Server Express** (o superior)
   - Descargar: https://www.microsoft.com/es-es/sql-server/sql-server-downloads
   - **SQL Server Management Studio (SSMS)** para gestionar la BD
   - Descargar SSMS: https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

3. **MongoDB Community Server**
   - Descargar: https://www.mongodb.com/try/download/community
   - Verificar instalación: `mongosh` o `mongo`

4. **Git** (opcional, para clonar)
   - Descargar: https://git-scm.com/

### Herramientas Opcionales (Recomendadas)

- **MongoDB Compass** - GUI para MongoDB
- **Postman** o **Thunder Client** - Para probar la API
- **VS Code** - Editor de código recomendado

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd plant-guide
```

O descarga el ZIP y extráelo.

---

### 2. Configurar SQL Server

#### 2.1 Habilitar TCP/IP y configurar puerto

1. Abre **SQL Server Configuration Manager**
2. Ve a: **SQL Server Network Configuration** → **Protocols for SQLEXPRESS**
3. Haz clic derecho en **TCP/IP** → **Enable**
4. Doble clic en **TCP/IP** → pestaña **IP Addresses**
5. Desplázate hasta **IPAll** y configura:
   - **TCP Dynamic Ports**: (dejar vacío)
   - **TCP Port**: `1433`
6. Guarda y cierra

#### 2.2 Iniciar servicios

1. Abre **Servicios** (`services.msc`)
2. Busca **SQL Server (SQLEXPRESS)**
   - Si está detenido: clic derecho → **Iniciar**
   - Clic derecho → **Propiedades** → Tipo de inicio: **Automático**
3. Busca **SQL Server Browser**
   - Si está detenido: clic derecho → **Iniciar**
   - Clic derecho → **Propiedades** → Tipo de inicio: **Automático**
4. Reinicia ambos servicios

#### 2.3 Crear base de datos y usuario

Abre **SQL Server Management Studio (SSMS)** y conéctate a tu instancia `(local)\SQLEXPRESS` o `NOMBRE_PC\SQLEXPRESS`.

Ejecuta el siguiente script SQL:

```sql
-- 1. Crear la base de datos
CREATE DATABASE PlantGuideDB;
GO

-- 2. Usar la base de datos
USE PlantGuideDB;
GO

-- 3. Crear el login a nivel de servidor
CREATE LOGIN guia_user WITH PASSWORD = '12345';
GO

-- 4. Crear el usuario en la base de datos
CREATE USER guia_user FOR LOGIN guia_user;
GO

-- 5. Dar permisos completos al usuario
ALTER ROLE db_owner ADD MEMBER guia_user;
GO

-- 6. Verificar que se creó correctamente
SELECT name FROM sys.database_principals WHERE name = 'guia_user';
GO
```

#### 2.4 Crear tablas

Ejecuta este script para crear las tablas necesarias:

```sql
USE PlantGuideDB;
GO

-- Tabla de Usuarios
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    passwordHash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    surveyCompleted BIT DEFAULT 0,
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Tabla de Encuestas
CREATE TABLE Surveys (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    experience NVARCHAR(50) NOT NULL,
    sunlight NVARCHAR(50) NOT NULL,
    space NVARCHAR(50) NOT NULL,
    petFriendly BIT DEFAULT 0,
    maintenanceLevel NVARCHAR(50) NOT NULL,
    climate NVARCHAR(50),
    purpose NVARCHAR(100),
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
GO

-- Índices
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_surveys_userId ON Surveys(userId);
GO

-- Verificar que las tablas se crearon
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO
```

#### 2.5 Verificar configuración

Ejecuta para verificar:

```sql
USE PlantGuideDB;
SELECT * FROM Users;
SELECT * FROM Surveys;
```

Deberías ver las tablas vacías sin errores.

---

### 3. Configurar MongoDB

#### 3.1 Verificar que MongoDB esté corriendo

```bash
# En Windows, verifica el servicio
services.msc
# Busca "MongoDB Server" y asegúrate que esté corriendo

# O desde terminal
mongosh
```

Si MongoDB no está corriendo, inícialo desde Servicios o ejecuta:

```bash
net start MongoDB
```

#### 3.2 Crear base de datos (se crea automáticamente)

MongoDB creará la base de datos `plantguide` automáticamente cuando el backend se conecte por primera vez.

---

### 4. Configurar Backend

#### 4.1 Instalar dependencias

```bash
cd backend
npm install
```

#### 4.2 Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` con tus datos reales:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# SQL Server Configuration
SQL_SERVER=localhost
SQL_DATABASE=PlantGuideDB
SQL_USER=guia_user
SQL_PASSWORD=12345
SQL_PORT=1433
SQL_ENCRYPT=true
SQL_TRUST_SERVER_CERTIFICATE=true

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/plantguide

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion_2024
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANTE:**
- Si tu instancia de SQL Server tiene un nombre diferente (ej: `DESKTOP-ABC123\SQLEXPRESS`), usa `localhost` en `SQL_SERVER`
- Cambia `JWT_SECRET` por una clave segura en producción
- Si usas autenticación de Windows en SQL Server, deja `SQL_USER` y `SQL_PASSWORD` vacíos

#### 4.3 Poblar la base de datos con plantas de ejemplo

```bash
node seed.js
```

Deberías ver:

```
🌱 Iniciando seed de plantas...
✅ Conectado a MongoDB
🗑️  Plantas anteriores eliminadas
✅ 6 plantas insertadas exitosamente
✅ Seed completado exitosamente
```

#### 4.4 Iniciar el servidor backend

```bash
npm run dev
```

Deberías ver:

```
✅ Conectado a SQL Server
✅ Conectado a MongoDB
📡 MongoDB: Conexión establecida
🚀 Servidor corriendo en puerto 5000
📍 http://localhost:5000
```

**✅ Backend configurado correctamente**

---

### 5. Configurar Frontend

#### 5.1 Instalar dependencias

Abre una **nueva terminal** (sin cerrar la del backend):

```bash
cd frontend
npm install
```

#### 5.2 Configurar variables de entorno (opcional)

El frontend ya tiene configurada la URL del backend en `src/services/api.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

Si tu backend corre en otro puerto, edita este archivo.

#### 5.3 Iniciar el servidor frontend

```bash
npm run dev
```

Deberías ver:

```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Frontend configurado correctamente**

---

## 🎮 Uso

### Acceder a la aplicación

1. **Abre tu navegador** en: `http://localhost:5173`
2. Verás la **Landing Page** con opciones de Login/Registro
3. **Regístrate** con un usuario nuevo
4. **Completa la encuesta** sobre tus preferencias
5. Recibe **recomendaciones personalizadas** de plantas
6. Explora el **catálogo**, guarda **favoritos** y más

### Flujo de Usuario

```
1. Landing Page
   ↓
2. Registro/Login
   ↓
3. Encuesta (obligatoria, solo una vez)
   ↓
4. Dashboard
   ↓
5. Recomendaciones, Plantas, Favoritos
```

---

## 📡 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | ❌ |
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| GET | `/api/auth/profile` | Obtener perfil | ✅ |

### Encuesta

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/survey/complete` | Completar encuesta | ✅ |
| GET | `/api/survey/my-survey` | Ver mi encuesta | ✅ |
| GET | `/api/survey/status` | Estado de encuesta | ✅ |

### Plantas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/plants` | Listar plantas | ❌ |
| GET | `/api/plants/:id` | Detalle de planta | ❌ |

### Recomendaciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/recommendations/generate` | Generar recomendaciones | ✅ |
| GET | `/api/recommendations/my-recommendations` | Ver recomendaciones | ✅ |
| POST | `/api/recommendations/regenerate` | Regenerar | ✅ |

### Favoritos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/favorites` | Agregar favorito | ✅ |
| GET | `/api/favorites` | Listar favoritos | ✅ |
| GET | `/api/favorites/stats` | Estadísticas | ✅ |
| GET | `/api/favorites/check/:plantId` | Verificar favorito | ✅ |
| PUT | `/api/favorites/:plantId/notes` | Actualizar notas | ✅ |
| DELETE | `/api/favorites/:plantId` | Eliminar favorito | ✅ |

### Admin (requiere rol ADMIN)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Estadísticas generales | 👑 |
| GET | `/api/admin/users` | Listar usuarios | 👑 |
| GET | `/api/admin/users/:userId` | Detalle usuario | 👑 |
| PUT | `/api/admin/users/:userId/role` | Cambiar rol | 👑 |
| PUT | `/api/admin/users/:userId/status` | Cambiar estado | 👑 |
| GET | `/api/admin/plants` | Listar plantas | 👑 |
| POST | `/api/admin/plants` | Crear planta | 👑 |
| PUT | `/api/admin/plants/:plantId` | Actualizar planta | 👑 |
| DELETE | `/api/admin/plants/:plantId` | Desactivar planta | 👑 |
| DELETE | `/api/admin/plants/:plantId/permanent` | Eliminar permanente | 👑 |
| PUT | `/api/admin/plants/:plantId/reactivate` | Reactivar planta | 👑 |

**Leyenda:**
- ❌ = Público (no requiere autenticación)
- ✅ = Requiere JWT token
- 👑 = Requiere JWT token + rol ADMIN

---

## 🔐 Variables de Entorno

### Backend (.env)

```env
# Servidor
PORT=5000                           # Puerto del servidor Express
NODE_ENV=development                # Entorno (development/production)

# SQL Server
SQL_SERVER=localhost                # Servidor SQL (localhost o IP)
SQL_DATABASE=PlantGuideDB           # Nombre de la base de datos
SQL_USER=guia_user                  # Usuario de SQL Server
SQL_PASSWORD=12345                  # Contraseña del usuario
SQL_PORT=1433                       # Puerto de SQL Server
SQL_ENCRYPT=true                    # Cifrado de conexión
SQL_TRUST_SERVER_CERTIFICATE=true   # Certificado de confianza

# MongoDB
MONGO_URI=mongodb://localhost:27017/plantguide  # URI de conexión

# JWT
JWT_SECRET=clave_secreta_muy_segura  # Clave para firmar tokens
JWT_EXPIRES_IN=7d                    # Expiración del token
```

---

## 📁 Estructura del Proyecto

```
plant-guide/
│
├── backend/                        # Servidor Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── sqlserver.js       # Conexión SQL Server
│   │   │   └── mongodb.js         # Conexión MongoDB
│   │   ├── models/
│   │   │   ├── sql/
│   │   │   │   ├── user.model.js  # Modelo de usuario
│   │   │   │   └── survey.model.js # Modelo de encuesta
│   │   │   └── mongo/
│   │   │       ├── plant.model.js
│   │   │       ├── favorite.model.js
│   │   │       └── recommendation.model.js
│   │   ├── controllers/           # Lógica de negocio
│   │   ├── middlewares/           # Auth, roles, etc.
│   │   ├── routes/                # Rutas de la API
│   │   ├── utils/                 # Utilidades
│   │   └── app.js                 # Config de Express
│   ├── .env                       # Variables de entorno
│   ├── server.js                  # Punto de entrada
│   ├── seed.js                    # Datos iniciales
│   └── package.json
│
├── frontend/                       # App React + Vite
│   ├── src/
│   │   ├── components/            # Componentes reutilizables
│   │   ├── pages/                 # Páginas
│   │   ├── context/               # Context API
│   │   ├── services/              # API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js         # Config Tailwind
│   └── package.json
│
└── README.md                       # Este archivo
```

---

## 👑 Crear Usuario Administrador

Por defecto, todos los usuarios nuevos tienen el rol `USER`. Para crear un administrador:

### Opción 1: Desde SQL Server

```sql
USE PlantGuideDB;
GO

-- Ver usuarios existentes
SELECT id, name, email, role FROM Users;

-- Cambiar rol a ADMIN (reemplaza el email por el correcto)
UPDATE Users 
SET role = 'ADMIN' 
WHERE email = 'tuusuario@example.com';

-- Verificar
SELECT id, name, email, role FROM Users WHERE role = 'ADMIN';
```

### Opción 2: Desde el panel Admin (si ya tienes un admin)

1. Inicia sesión como ADMIN
2. Ve a **Panel Admin** → **Usuarios**
3. Busca el usuario
4. Cambia su rol a ADMIN

### Crear el primer Admin

Si es tu primera instalación:

1. Regístrate normalmente en la app
2. Ve a SSMS y ejecuta:

```sql
UPDATE Users SET role = 'ADMIN' WHERE email = 'tu@email.com';
```

3. Cierra sesión y vuelve a iniciar sesión
4. Ahora tendrás acceso al Panel Admin

---

## 🐛 Solución de Problemas

### Backend no conecta a SQL Server

**Error:** `The "config.server" property is required`

**Solución:**
1. Verifica que el archivo `.env` esté en la carpeta `backend/`
2. Asegúrate de que las variables estén bien escritas
3. Prueba ejecutar:
```bash
node -e "require('dotenv').config(); console.log(process.env.SQL_SERVER)"
```

**Error:** `Login failed for user 'guia_user'`

**Solución:**
1. Verifica que el usuario exista en SQL Server
2. Verifica que la contraseña sea correcta
3. Asegúrate de que tenga permisos en la base de datos

### Backend no conecta a MongoDB

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solución:**
1. Verifica que MongoDB esté corriendo:
```bash
mongosh
```
2. Si no está corriendo, inícialo:
```bash
net start MongoDB
```

### Frontend no conecta al Backend

**Error:** `Network Error` o `ERR_CONNECTION_REFUSED`

**Solución:**
1. Verifica que el backend esté corriendo en `http://localhost:5000`
2. Verifica CORS en `backend/src/app.js`:
```javascript
app.use(cors());
```
3. Verifica la URL en `frontend/src/services/api.js`

### JWT Token expirado

**Error:** `Token expirado` al usar la app

**Solución:**
1. Cierra sesión y vuelve a iniciar
2. El token expira según `JWT_EXPIRES_IN` en `.env`
3. Puedes cambiar el tiempo de expiración

### Puerto 5000 ya en uso

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solución:**
1. Cambia el puerto en `backend/.env`:
```env
PORT=5001
```
2. Actualiza la URL en `frontend/src/services/api.js`

### No se cargan las plantas

**Solución:**
1. Ejecuta el seed de nuevo:
```bash
cd backend
node seed.js
```
2. Verifica en MongoDB:
```bash
mongosh
use plantguide
db.plants.find().pretty()
```

## 📚 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de SQL Server](https://learn.microsoft.com/en-us/sql/)
- [Documentación de MongoDB](https://www.mongodb.com/docs/)
- [Documentación de DaisyUI](https://daisyui.com/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)

---

---

> **Nota:** Este README se actualiza constantemente