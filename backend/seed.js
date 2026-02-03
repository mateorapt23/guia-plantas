require('dotenv').config();
const connectMongoDB = require('./src/config/mongodb');
const seedPlants = require('./src/utils/seedPlants');

const runSeed = async () => {
  try {
    console.log('🌱 Iniciando seed de plantas...');
    
    // Conectar a MongoDB
    await connectMongoDB();
    
    // Ejecutar seed
    await seedPlants();
    
    console.log('✅ Seed completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

runSeed();