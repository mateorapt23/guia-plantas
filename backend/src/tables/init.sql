USE guia_plantas;
GO

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

-- Índices para mejorar rendimiento
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
