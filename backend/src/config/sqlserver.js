const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: parseInt(process.env.SQL_PORT),
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

const connectSQL = async () => {
  try {
    if (pool) {
      return pool;
    }
    
    pool = await sql.connect(config);
    console.log('✅ Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a SQL Server:', error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('SQL Server no está conectado. Llama a connectSQL() primero.');
  }
  return pool;
};

const closeSQL = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✅ Conexión a SQL Server cerrada');
    }
  } catch (error) {
    console.error('❌ Error cerrando SQL Server:', error.message);
  }
};

module.exports = {
  sql,
  connectSQL,
  getPool,
  closeSQL
};