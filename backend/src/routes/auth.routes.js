const express = require('express');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rutas protegidas
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;