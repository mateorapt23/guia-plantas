const express = require('express');
const FavoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Agregar a favoritos
router.post('/', FavoriteController.addFavorite);

// Obtener todos los favoritos
router.get('/', FavoriteController.getFavorites);

// Obtener estadísticas de favoritos
router.get('/stats', FavoriteController.getFavoriteStats);

// Verificar si una planta está en favoritos
router.get('/check/:plantId', FavoriteController.checkFavorite);

// Actualizar notas de un favorito
router.put('/:plantId/notes', FavoriteController.updateFavoriteNotes);

// Eliminar de favoritos
router.delete('/:plantId', FavoriteController.removeFavorite);

module.exports = router;