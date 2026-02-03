const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const surveyRoutes = require('./routes/survey.routes');
const plantRoutes = require('./routes/plant.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🌱 Plant Guide API',
    version: '1.0.0',
    status: 'running'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;