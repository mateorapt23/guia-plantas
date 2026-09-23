const pool = require('../../config/db');

class SurveyModel {
  static async create(surveyData) {
    const result = await pool.query(
      `INSERT INTO surveys
        ("userId", experience, sunlight, space, "petFriendly", "maintenanceLevel", climate, purpose)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        surveyData.userId,
        surveyData.experience,
        surveyData.sunlight,
        surveyData.space,
        surveyData.petFriendly,
        surveyData.maintenanceLevel,
        surveyData.climate || null,
        surveyData.purpose || null,
      ]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM surveys
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    return result.rows[0] || null;
  }

  static async exists(userId) {
    const result = await pool.query(
      `SELECT COUNT(*) AS count FROM surveys WHERE "userId" = $1`,
      [userId]
    );
    return parseInt(result.rows[0].count, 10) > 0;
  }
}

module.exports = SurveyModel;