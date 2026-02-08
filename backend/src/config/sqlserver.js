// Importamos la librería mssql para manejar conexiones con SQL Server
const sql = require('mssql');

// Cargamos las variables de entorno desde el archivo .env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Definimos la configuración de conexión a SQL Server usando nuestras variables de entorno
const config = {
  server: process.env.SQL_SERVER,        // Dirección de nuestro servidor SQL
  database: process.env.SQL_DATABASE,    // Nombre de nuestra base de datos
  user: process.env.SQL_USER,            // Usuario con el que nos conectamos a SQL Server
  password: process.env.SQL_PASSWORD,    // Contraseña del usuario
  port: parseInt(process.env.SQL_PORT),  // Puerto de conexión convertido a número,

  // Definimos opciones adicionales de seguridad y compatibilidad
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true', // Indicamos si nuestra conexión será cifrada
    trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === 'true', // Permitimos certificados no confiables si está activado
    enableArithAbort: true, // Configuración que usamos para estabilidad de consultas
  },

  // Configuramos nuestro pool de conexiones (manejo de múltiples conexiones)
  pool: {
    max: 10,              // Máximo de conexiones simultáneas que permitimos
    min: 0,               // Mínimo de conexiones activas
    idleTimeoutMillis: 30000 // Tiempo que esperamos antes de cerrar conexiones inactivas
  }
};

// Creamos una variable para almacenar nuestro pool de conexiones activo
let pool = null;

// Función principal con la que nos conectamos a SQL Server
const connectSQL = async () => {
  try {
    // Si ya tenemos una conexión activa, la reutilizamos
    if (pool) {
      return pool;
    }
    
    // Establecemos una nueva conexión usando nuestra configuración
    pool = await sql.connect(config);

    // Mostramos mensaje cuando la conexión es exitosa
    console.log('✅ Conectado a SQL Server');

    // Devolvemos el pool para usarlo en nuestras consultas
    return pool;
  } catch (error) {
    // Mostramos el error si falla la conexión
    console.error('❌ Error conectando a SQL Server:', error.message);

    // Lanzamos el error para manejarlo en otra parte de la aplicación
    throw error;
  }
};

// Función para obtener el pool de conexiones que ya creamos
const getPool = () => {
  // Verificamos si ya nos conectamos antes
  if (!pool) {
    throw new Error('SQL Server no está conectado. Llama a connectSQL() primero.');
  }

  // Devolvemos nuestro pool activo
  return pool;
};

// Función para cerrar nuestra conexión con SQL Server
const closeSQL = async () => {
  try {
    // Solo cerramos la conexión si el pool existe
    if (pool) {
      await pool.close(); // Cerramos el pool de conexiones
      pool = null;        // Reiniciamos la variable del pool

      console.log('✅ Conexión a SQL Server cerrada');
    }
  } catch (error) {
    // Mostramos cualquier error al cerrar la conexión
    console.error('❌ Error cerrando SQL Server:', error.message);
  }
};

// Exportamos nuestras funciones y el objeto sql para usarlos en otros archivos
module.exports = {
  sql,        // Librería principal de mssql que utilizamos
  connectSQL, // Función con la que nos conectamos
  getPool,    // Función con la que obtenemos la conexión activa
  closeSQL    // Función con la que cerramos la conexión
};
