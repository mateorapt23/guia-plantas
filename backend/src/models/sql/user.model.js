const { getPool, sql } = require('../../config/sqlserver');

class UserModel {
  // Crear usuario
  static async create({ name, email, passwordHash, role = 'USER' }) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .input('passwordHash', sql.NVarChar, passwordHash)
        .input('role', sql.NVarChar, role)
        .query(`
          INSERT INTO Users (name, email, passwordHash, role)
          OUTPUT INSERTED.*
          VALUES (@name, @email, @passwordHash, @role)
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar por email
  static async findByEmail(email) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');
      
      return result.recordset[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Buscar por ID
  static async findById(id) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Users WHERE id = @id');
      
      return result.recordset[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar surveyCompleted
  static async updateSurveyCompleted(userId, completed = true) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('completed', sql.Bit, completed)
        .query(`
          UPDATE Users 
          SET surveyCompleted = @completed, updatedAt = GETDATE()
          WHERE id = @userId
        `);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw error;
    }
  }

  // Listar todos los usuarios (para admin)
  static async findAll() {
    try {
      const pool = getPool();
      const result = await pool.request()
        .query('SELECT id, name, email, role, surveyCompleted, isActive, createdAt FROM Users ORDER BY createdAt DESC');
      
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar rol (para admin)
  static async updateRole(userId, newRole) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('role', sql.NVarChar, newRole)
        .query(`
          UPDATE Users 
          SET role = @role, updatedAt = GETDATE()
          WHERE id = @userId
        `);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw error;
    }
  }

  // Activar/desactivar usuario
  static async updateActiveStatus(userId, isActive) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('isActive', sql.Bit, isActive)
        .query(`
          UPDATE Users 
          SET isActive = @isActive, updatedAt = GETDATE()
          WHERE id = @userId
        `);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;