const Favorite = require('../models/mongo/favorite.model');
const Plant = require('../models/mongo/plant.model');

class FavoriteController {
  // Agregar planta a favoritos
  static async addFavorite(req, res) {
    try {
      const userId = req.user.userId;
      const { plantId, notes } = req.body;

      // Validar que plantId esté presente
      if (!plantId) {
        return res.status(400).json({
          error: 'plantId es requerido'
        });
      }

      // Verificar que la planta existe
      const plant = await Plant.findById(plantId);
      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      // Verificar si ya está en favoritos
      const existingFavorite = await Favorite.findOne({ userId, plantId });
      if (existingFavorite) {
        return res.status(400).json({
          error: 'Esta planta ya está en tus favoritos',
          favorite: existingFavorite
        });
      }

      // Crear favorito
      const favorite = new Favorite({
        userId,
        plantId,
        notes: notes || ''
      });

      await favorite.save();

      // Obtener el favorito con la info de la planta
      const populatedFavorite = await Favorite.findById(favorite._id)
        .populate('plantId');

      res.status(201).json({
        message: 'Planta agregada a favoritos',
        favorite: populatedFavorite
      });

    } catch (error) {
      console.error('Error al agregar favorito:', error);
      res.status(500).json({
        error: 'Error al agregar a favoritos'
      });
    }
  }

  // Obtener todos los favoritos del usuario
  static async getFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10 } = req.query;

      const favorites = await Favorite.find({ userId })
        .populate('plantId')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ addedAt: -1 });

      const count = await Favorite.countDocuments({ userId });

      res.json({
        favorites,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalFavorites: count
      });

    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      res.status(500).json({
        error: 'Error al obtener favoritos'
      });
    }
  }

  // Eliminar planta de favoritos
  static async removeFavorite(req, res) {
    try {
      const userId = req.user.userId;
      const { plantId } = req.params;

      // Buscar y eliminar
      const favorite = await Favorite.findOneAndDelete({ 
        userId, 
        plantId 
      });

      if (!favorite) {
        return res.status(404).json({
          error: 'Favorito no encontrado'
        });
      }

      res.json({
        message: 'Planta eliminada de favoritos',
        plantId: favorite.plantId
      });

    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      res.status(500).json({
        error: 'Error al eliminar de favoritos'
      });
    }
  }

  // Verificar si una planta está en favoritos
  static async checkFavorite(req, res) {
    try {
      const userId = req.user.userId;
      const { plantId } = req.params;

      const favorite = await Favorite.findOne({ userId, plantId });

      res.json({
        isFavorite: !!favorite,
        favorite: favorite || null
      });

    } catch (error) {
      console.error('Error al verificar favorito:', error);
      res.status(500).json({
        error: 'Error al verificar favorito'
      });
    }
  }

  // Actualizar notas de un favorito
  static async updateFavoriteNotes(req, res) {
    try {
      const userId = req.user.userId;
      const { plantId } = req.params;
      const { notes } = req.body;

      const favorite = await Favorite.findOneAndUpdate(
        { userId, plantId },
        { notes: notes || '' },
        { new: true }
      ).populate('plantId');

      if (!favorite) {
        return res.status(404).json({
          error: 'Favorito no encontrado'
        });
      }

      res.json({
        message: 'Notas actualizadas',
        favorite
      });

    } catch (error) {
      console.error('Error al actualizar notas:', error);
      res.status(500).json({
        error: 'Error al actualizar notas'
      });
    }
  }

  // Obtener estadísticas de favoritos
  static async getFavoriteStats(req, res) {
    try {
      const userId = req.user.userId;

      const total = await Favorite.countDocuments({ userId });
      
      const favorites = await Favorite.find({ userId }).populate('plantId');
      
      // Agrupar por categorías
      const stats = {
        total,
        byDifficulty: {
          beginner: 0,
          intermediate: 0,
          expert: 0
        },
        bySunlight: {
          low: 0,
          medium: 0,
          high: 0
        },
        petFriendly: 0,
        airPurifying: 0
      };

      favorites.forEach(fav => {
        if (fav.plantId) {
          stats.byDifficulty[fav.plantId.care.difficulty]++;
          stats.bySunlight[fav.plantId.care.sunlight]++;
          if (fav.plantId.petFriendly) stats.petFriendly++;
          if (fav.plantId.airPurifying) stats.airPurifying++;
        }
      });

      res.json({
        stats,
        message: 'Estadísticas de favoritos'
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        error: 'Error al obtener estadísticas'
      });
    }
  }
}

module.exports = FavoriteController;