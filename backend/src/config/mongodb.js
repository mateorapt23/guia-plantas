const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB: Conexión establecida');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB: Error de conexión:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB: Desconectado');
});

// Cerrar conexión cuando la app se cierra
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('✅ MongoDB: Conexión cerrada por terminación de app');
  process.exit(0);
});

module.exports = connectMongoDB;