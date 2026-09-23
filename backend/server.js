const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./src/app');
const pool = require('./src/config/db');
const connectMongoDB = require('./src/config/mongodb');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verifica la conexión a PostgreSQL antes de arrancar
    await pool.query('SELECT 1');
    console.log('✅ Conectado a PostgreSQL');

    // Conectar a MongoDB
    await connectMongoDB();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM recibido, cerrando servidor...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️  SIGINT recibido, cerrando servidor...');
  await pool.end();
  process.exit(0);
});

startServer();