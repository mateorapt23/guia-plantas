// Importa mongoose para poder interactuar con MongoDB
const mongoose = require('mongoose');

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Función principal encargada de conectar la aplicación con MongoDB
const connectMongoDB = async () => {
  try {
    // Intenta establecer conexión con la base de datos usando la URI del archivo .env
    await mongoose.connect(process.env.MONGO_URI);

    // Mensaje de éxito si la conexión se realiza correctamente
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    // Captura y muestra el error si falla la conexión
    console.error('❌ Error conectando a MongoDB:', error.message);

    // Detiene la aplicación si no se puede conectar a la base de datos
    process.exit(1);
  }
};

// -------------------- MANEJO DE EVENTOS DE CONEXIÓN --------------------

// Se ejecuta cuando la conexión con MongoDB se establece correctamente
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB: Conexión establecida');
});

// Se ejecuta si ocurre un error en la conexión con MongoDB
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB: Error de conexión:', err);
});

// Se ejecuta cuando la conexión con MongoDB se pierde o se cierra
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB: Desconectado');
});



// Escucha cuando la aplicación se cierra manualmente (Ctrl + C en la terminal)
process.on('SIGINT', async () => {
  // Cierra la conexión con MongoDB antes de terminar la app
  await mongoose.connection.close();

  console.log('✅ MongoDB: Conexión cerrada por terminación de app');

  // Finaliza el proceso de Node.js
  process.exit(0);
});

// Exporta la función para usarla en otros archivos (por ejemplo, en server.js)
module.exports = connectMongoDB;
