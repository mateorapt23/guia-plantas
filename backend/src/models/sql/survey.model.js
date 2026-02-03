const { getPool, sql } = require('../../config/sqlserver');

class SurveyModel {
  // Crear encuesta
  static async create(surveyData) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('userId', sql.Int, surveyData.userId)
        .input('experience', sql.NVarChar, surveyData.experience)
        .input('sunlight', sql.NVarChar, surveyData.sunlight)
        .input('space', sql.NVarChar, surveyData.space)
        .input('petFriendly', sql.Bit, surveyData.petFriendly)
        .input('maintenanceLevel', sql.NVarChar, surveyData.maintenanceLevel)
        .input('climate', sql.NVarChar, surveyData.climate || null)
        .input('purpose', sql.NVarChar, surveyData.purpose || null)
        .query(`
          INSERT INTO Surveys (userId, experience, sunlight, space, petFriendly, maintenanceLevel, climate, purpose)
          OUTPUT INSERTED.*
          VALUES (@userId, @experience, @sunlight, @space, @petFriendly, @maintenanceLevel, @climate, @purpose)
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar encuesta por userId
  static async findByUserId(userId) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Surveys WHERE userId = @userId ORDER BY createdAt DESC');
      
      return result.recordset[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Verificar si el usuario ya tiene encuesta
  static async exists(userId) {
    try {
      const pool = getPool();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT COUNT(*) as count FROM Surveys WHERE userId = @userId');
      
      return result.recordset[0].count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SurveyModel;