USE guia_plantas;
GO

-- ===============================
-- 📌 CREACIÓN DE TABLAS (EXISTENTE)
-- ===============================

-- Tabla de Usuarios
IF NOT EXISTS (
    SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type = N'U'
)
BEGIN
    CREATE TABLE dbo.Users (
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
END
GO

-- Tabla de Encuestas (respuestas del formulario inicial)
IF NOT EXISTS (
    SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Surveys]') AND type = N'U'
)
BEGIN
    CREATE TABLE dbo.Surveys (
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
        FOREIGN KEY (userId) REFERENCES dbo.Users(id) ON DELETE CASCADE
    );
END
GO

-- ===============================
-- 📌 ÍNDICES (EXISTENTE)
-- ===============================

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_users_email' AND object_id = OBJECT_ID(N'dbo.Users'))
    CREATE INDEX idx_users_email ON dbo.Users(email);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_users_role' AND object_id = OBJECT_ID(N'dbo.Users'))
    CREATE INDEX idx_users_role ON dbo.Users(role);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_surveys_userId' AND object_id = OBJECT_ID(N'dbo.Surveys'))
    CREATE INDEX idx_surveys_userId ON dbo.Surveys(userId);
GO

-- Verificar que las tablas se crearon
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- ======================================================
-- ✅ AQUÍ EMPIEZAN TUS PROCEDIMIENTOS ALMACENADOS
-- (TODO LO DE ARRIBA QUEDA IGUAL)
-- ======================================================

/* --------------------------------------------------
   PROCEDIMIENTO: Obtener usuario por ID
-------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.procedures WHERE name = 'sp_GetUserById')
BEGIN
    EXEC('
    CREATE PROCEDURE sp_GetUserById
        @UserId INT
    AS
    BEGIN
        SELECT id, name, email, role, surveyCompleted, isActive, createdAt
        FROM dbo.Users
        WHERE id = @UserId;
    END
    ');
END
GO

/* --------------------------------------------------
   PROCEDIMIENTO: Obtener usuario por EMAIL
-------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.procedures WHERE name = 'sp_GetUserByEmail')
BEGIN
    EXEC('
    CREATE PROCEDURE sp_GetUserByEmail
        @Email NVARCHAR(255)
    AS
    BEGIN
        SELECT *
        FROM dbo.Users
        WHERE email = @Email;
    END
    ');
END
GO

/* --------------------------------------------------
   PROCEDIMIENTO: Crear nuevo usuario
-------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.procedures WHERE name = 'sp_CreateUser')
BEGIN
    EXEC('
    CREATE PROCEDURE sp_CreateUser
        @Name NVARCHAR(100),
        @Email NVARCHAR(255),
        @PasswordHash NVARCHAR(255),
        @Role NVARCHAR(20) = ''USER''
    AS
    BEGIN
        INSERT INTO dbo.Users (name, email, passwordHash, role)
        VALUES (@Name, @Email, @PasswordHash, @Role);

        SELECT SCOPE_IDENTITY() AS newUserId;
    END
    ');
END
GO

/* --------------------------------------------------
   PROCEDIMIENTO: Guardar encuesta del usuario
-------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.procedures WHERE name = 'sp_SaveSurvey')
BEGIN
    EXEC('
    CREATE PROCEDURE sp_SaveSurvey
        @UserId INT,
        @Experience NVARCHAR(50),
        @Sunlight NVARCHAR(50),
        @Space NVARCHAR(50),
        @PetFriendly BIT,
        @MaintenanceLevel NVARCHAR(50),
        @Climate NVARCHAR(50),
        @Purpose NVARCHAR(100)
    AS
    BEGIN
        INSERT INTO dbo.Surveys (
            userId, experience, sunlight, space, 
            petFriendly, maintenanceLevel, climate, purpose
        )
        VALUES (
            @UserId, @Experience, @Sunlight, @Space,
            @PetFriendly, @MaintenanceLevel, @Climate, @Purpose
        );

        -- Marcar que el usuario ya completó la encuesta
        UPDATE dbo.Users
        SET surveyCompleted = 1,
            updatedAt = GETDATE()
        WHERE id = @UserId;
    END
    ');
END
GO

/* --------------------------------------------------
   PROCEDIMIENTO: Obtener encuesta por usuario
-------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.procedures WHERE name = 'sp_GetSurveyByUser')
BEGIN
    EXEC('
    CREATE PROCEDURE sp_GetSurveyByUser
        @UserId INT
    AS
    BEGIN
        SELECT *
        FROM dbo.Surveys
        WHERE userId = @UserId;
    END
    ');
END
GO
