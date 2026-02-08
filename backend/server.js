const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const app = require('./src/app');
const { connectSQL, closeSQL } = require('./src/config/sqlserver');
const connectMongoDB = require('./src/config/mongodb');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar a SQL Server
    await connectSQL();
    
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

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('⚠️ SIGTERM recibido, cerrando servidor...');
  await closeSQL();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️ SIGINT recibido, cerrando servidor...');
  await closeSQL();
  process.exit(0);
});

startServer();