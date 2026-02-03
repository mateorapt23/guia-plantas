const express = require('express');
const RecommendationController = require('../controllers/recommendation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Generar recomendaciones (primera vez)
router.post('/generate', RecommendationController.generateRecommendations);

// Obtener mis recomendaciones guardadas
router.get('/my-recommendations', RecommendationController.getMyRecommendations);

// Regenerar recomendaciones (si cambió la encuesta)
router.post('/regenerate', RecommendationController.regenerateRecommendations);

module.exports = router;