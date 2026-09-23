const pool = require('../../config/db');

class UserModel {
  static async create({ name, email, passwordHash, role = 'USER' }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, "passwordHash", role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, passwordHash, role]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT id, name, email, role, "surveyCompleted", "isActive", "createdAt"
       FROM users
       ORDER BY "createdAt" DESC`
    );
    return result.rows;
  }

  static async updateSurveyCompleted(userId, completed = true) {
    const result = await pool.query(
      `UPDATE users
       SET "surveyCompleted" = $1, "updatedAt" = NOW()
       WHERE id = $2`,
      [completed, userId]
    );
    return result.rowCount > 0;
  }

  static async updateRole(userId, newRole) {
    const result = await pool.query(
      `UPDATE users
       SET role = $1, "updatedAt" = NOW()
       WHERE id = $2`,
      [newRole, userId]
    );
    return result.rowCount > 0;
  }

  static async updateActiveStatus(userId, isActive) {
    const result = await pool.query(
      `UPDATE users
       SET "isActive" = $1, "updatedAt" = NOW()
       WHERE id = $2`,
      [isActive, userId]
    );
    return result.rowCount > 0;
  }
}

module.exports = UserModel;