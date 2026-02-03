# 🌱 Guía de Plantas – Backend

Backend del proyecto **Guía de Plantas**, desarrollado con **Node.js**, **Express**, **SQL Server Express** y **MongoDB**.  
Incluye autenticación con **JWT**, uso de base de datos relacional y NoSQL, y carga de datos iniciales mediante *seed*.

Este README está pensado para **reinstalar y configurar el proyecto desde cero en otra máquina** (Windows).

---

## 📌 Tecnologías utilizadas

- Node.js
- Express
- SQL Server Express
- MongoDB
- JWT
- dotenv

---

## 📁 Estructura del proyecto

guiaplantas/
│
├── src/
│ ├── config/
│ │ ├── sql.js
│ │ └── mongo.js
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── seeds/
│ │ └── seedPlants.js
│ └── app.js
│
├── .env
├── package.json
└── README.md


---

## ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# SQL Server Configuration
SQL_SERVER=localhost
SQL_DATABASE=guia_plantas
SQL_USER=guia_user
SQL_PASSWORD=12345
SQL_PORT=1433
SQL_ENCRYPT=true
SQL_TRUST_SERVER_CERTIFICATE=true

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/plantguide

# JWT Configuration
JWT_SECRET=guiaplantas_super_secret_123
JWT_EXPIRES_IN=7d
🧰 Requisitos previos (NUEVA MÁQUINA)
1️⃣ Instalar Node.js
Descargar versión LTS:
https://nodejs.org

Verificar:

node -v
npm -v
2️⃣ Instalar SQL Server Express (Windows)
Descargar:
https://www.microsoft.com/sql-server/sql-server-downloads

Elegir:

SQL Server Express

Instalación Basic o Custom

La instancia por defecto será algo como:

DESKTOP\SQLEXPRESS
3️⃣ Instalar SQL Server Management Studio (SSMS)
https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms

4️⃣ Instalar MongoDB
MongoDB Community Server
https://www.mongodb.com/try/download/community

MongoDB Compass (opcional)

Verificar:

mongod
🗄️ Configuración COMPLETA de SQL Server
🔹 1. Conectarse al servidor
Abrir SSMS y conectarse usando:

Server name: DESKTOP\SQLEXPRESS
Authentication: Windows Authentication
🔹 2. Crear la base de datos
CREATE DATABASE guia_plantas;
GO
🔹 3. Crear el login (usuario SQL)
CREATE LOGIN guia_user
WITH PASSWORD = '12345';
GO
🔹 4. Asignar usuario a la base de datos
USE guia_plantas;
GO

CREATE USER guia_user FOR LOGIN guia_user;
GO

ALTER ROLE db_owner ADD MEMBER guia_user;
GO
🔹 5. Habilitar autenticación SQL Server
Click derecho en el servidor

Properties

Security

Seleccionar:

SQL Server and Windows Authentication mode
Reiniciar SQL Server

🔹 6. Habilitar TCP/IP (OBLIGATORIO)
Abrir SQL Server Configuration Manager

SQL Server Network Configuration

Protocols for SQLEXPRESS

Habilitar TCP/IP

TCP/IP → Properties → IPAll

TCP Port: 1433
Reiniciar SQL Server

🔹 7. Permitir conexiones remotas
En SSMS:

Server Properties

Connections

Activar:

Allow remote connections to this server
🧱 Creación de tablas (ejemplo base)
USE guia_plantas;
GO

CREATE TABLE plantas (
    id INT IDENTITY PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    nombre_cientifico NVARCHAR(150),
    dificultad NVARCHAR(50),
    precio DECIMAL(10,2),
    descripcion NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
);
GO
(Las demás tablas se crean automáticamente o según los modelos del proyecto)

🌱 Insertar datos iniciales (SEED)
El proyecto incluye un archivo de seed:

src/seeds/seedPlants.js
Ejecutar:

node src/seeds/seedPlants.js
O agregar script en package.json:

"scripts": {
  "seed": "node src/seeds/seedPlants.js"
}
Luego:

npm run seed
Esto insertará las plantas iniciales en la base de datos SQL Server.

🍃 Configuración de MongoDB
▶️ Iniciar MongoDB
mongod
▶️ Base usada
mongodb://localhost:27017/plantguide
MongoDB se utiliza para:

recomendaciones

favoritos

historial

datos no relacionales

🔐 Autenticación JWT
Configuración desde .env:

JWT_SECRET=guiaplantas_super_secret_123
JWT_EXPIRES_IN=7d
Se utiliza para:

login

rutas protegidas

control de roles

▶️ Ejecutar el proyecto
Instalar dependencias
npm install
Ejecutar servidor
npm run dev
o

npm start
Servidor disponible en:

http://localhost:5000
❗ Errores comunes y soluciones
❌ ECONNREFUSED 127.0.0.1:1433
TCP/IP no habilitado

SQL Server no reiniciado

❌ Login failed for user
Usuario no asignado a la base de datos

Modo SQL Server no habilitado

❌ MongoDB connection refused
mongod no está ejecutándose
