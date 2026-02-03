const express = require('express');
const SurveyController = require('../controllers/survey.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Completar encuesta
router.post('/complete', SurveyController.completeSurvey);

// Obtener encuesta del usuario
router.get('/my-survey', SurveyController.getSurvey);

// Verificar estado de la encuesta
router.get('/status', SurveyController.checkSurveyStatus);

module.exports = router;