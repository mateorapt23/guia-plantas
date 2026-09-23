-- ============================================
-- Esquema Postgres para Guía de Plantas
-- Correr esto en el SQL Editor de Neon (una sola vez)
-- ============================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    "surveyCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de Encuestas
CREATE TABLE IF NOT EXISTS surveys (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience VARCHAR(50) NOT NULL,
    sunlight VARCHAR(50) NOT NULL,
    space VARCHAR(50) NOT NULL,
    "petFriendly" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceLevel" VARCHAR(50) NOT NULL,
    climate VARCHAR(50),
    purpose VARCHAR(100),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_surveys_userid ON surveys("userId");

-- Nota: los procedimientos almacenados de la versión SQL Server (sp_GetUserById, etc.)
-- no se migran porque el código de la aplicación nunca los llama — las consultas
-- se hacen directo desde los modelos (user.model.js / survey.model.js).