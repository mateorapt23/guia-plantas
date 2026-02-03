const UserModel = require('../models/sql/user.model');
const SurveyModel = require('../models/sql/survey.model');
const Plant = require('../models/mongo/plant.model');
const Recommendation = require('../models/mongo/recommendation.model');
const Favorite = require('../models/mongo/favorite.model');

class AdminController {
  // ========== GESTIÓN DE USUARIOS ==========
  
  // Listar todos los usuarios
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();

      res.json({
        totalUsers: users.length,
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          surveyCompleted: user.surveyCompleted,
          isActive: user.isActive,
          createdAt: user.createdAt
        }))
      });

    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        error: 'Error al obtener usuarios'
      });
    }
  }

  // Obtener detalles de un usuario específico
  static async getUserDetails(req, res) {
    try {
      const { userId } = req.params;

      // Obtener datos del usuario
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // Obtener encuesta del usuario
      const survey = await SurveyModel.findByUserId(userId);

      // Obtener favoritos del usuario
      const favorites = await Favorite.find({ userId: parseInt(userId) })
        .populate('plantId');

      // Obtener recomendaciones del usuario
      const recommendations = await Recommendation.findOne({ userId: parseInt(userId) })
        .populate('plants.plantId');

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          surveyCompleted: user.surveyCompleted,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        survey,
        favorites: favorites.length,
        hasRecommendations: !!recommendations
      });

    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      res.status(500).json({
        error: 'Error al obtener detalles del usuario'
      });
    }
  }

  // Cambiar rol de usuario
  static async changeUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Validar rol
      if (!role || !['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({
          error: 'Rol inválido. Debe ser USER o ADMIN'
        });
      }

      // Verificar que el usuario existe
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // Actualizar rol
      await UserModel.updateRole(userId, role);

      res.json({
        message: `Rol actualizado a ${role}`,
        userId: parseInt(userId),
        newRole: role
      });

    } catch (error) {
      console.error('Error al cambiar rol:', error);
      res.status(500).json({
        error: 'Error al cambiar rol del usuario'
      });
    }
  }

  // Activar/Desactivar usuario
  static async toggleUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      // Validar isActive
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          error: 'isActive debe ser true o false'
        });
      }

      // Verificar que el usuario existe
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // Prevenir que el admin se desactive a sí mismo
      if (req.user.userId === parseInt(userId) && !isActive) {
        return res.status(400).json({
          error: 'No puedes desactivarte a ti mismo'
        });
      }

      // Actualizar estado
      await UserModel.updateActiveStatus(userId, isActive);

      res.json({
        message: `Usuario ${isActive ? 'activado' : 'desactivado'}`,
        userId: parseInt(userId),
        isActive
      });

    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      res.status(500).json({
        error: 'Error al cambiar estado del usuario'
      });
    }
  }

  // ========== GESTIÓN DE PLANTAS ==========

  // Obtener todas las plantas (incluyendo inactivas)
  static async getAllPlantsAdmin(req, res) {
    try {
      const { page = 1, limit = 20, status = 'all' } = req.query;

      let query = {};
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }

      const plants = await Plant.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const count = await Plant.countDocuments(query);

      res.json({
        plants,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalPlants: count
      });

    } catch (error) {
      console.error('Error al obtener plantas:', error);
      res.status(500).json({
        error: 'Error al obtener plantas'
      });
    }
  }

  // Crear planta
  static async createPlantAdmin(req, res) {
    try {
      const plantData = req.body;

      // Validaciones básicas
      if (!plantData.name || !plantData.description) {
        return res.status(400).json({
          error: 'name y description son requeridos'
        });
      }

      if (!plantData.care || !plantData.care.sunlight || !plantData.care.watering || 
          !plantData.care.maintenance || !plantData.care.difficulty) {
        return res.status(400).json({
          error: 'Todos los campos de care son requeridos: sunlight, watering, maintenance, difficulty'
        });
      }

      if (!plantData.size) {
        return res.status(400).json({
          error: 'size es requerido'
        });
      }

      const newPlant = new Plant(plantData);
      await newPlant.save();

      res.status(201).json({
        message: 'Planta creada exitosamente',
        plant: newPlant
      });

    } catch (error) {
      console.error('Error al crear planta:', error);
      res.status(500).json({
        error: 'Error al crear la planta',
        details: error.message
      });
    }
  }

  // Actualizar planta
  static async updatePlantAdmin(req, res) {
    try {
      const { plantId } = req.params;
      const updateData = req.body;

      const plant = await Plant.findByIdAndUpdate(
        plantId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      res.json({
        message: 'Planta actualizada exitosamente',
        plant
      });

    } catch (error) {
      console.error('Error al actualizar planta:', error);
      res.status(500).json({
        error: 'Error al actualizar la planta',
        details: error.message
      });
    }
  }

  // Eliminar planta (soft delete)
  static async deletePlantAdmin(req, res) {
    try {
      const { plantId } = req.params;

      const plant = await Plant.findByIdAndUpdate(
        plantId,
        { isActive: false },
        { new: true }
      );

      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      res.json({
        message: 'Planta desactivada exitosamente',
        plant
      });

    } catch (error) {
      console.error('Error al desactivar planta:', error);
      res.status(500).json({
        error: 'Error al desactivar la planta'
      });
    }
  }

  // Eliminar planta permanentemente
  static async permanentDeletePlantAdmin(req, res) {
    try {
      const { plantId } = req.params;

      const plant = await Plant.findByIdAndDelete(plantId);

      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      // Eliminar referencias en favoritos y recomendaciones
      await Favorite.deleteMany({ plantId });
      await Recommendation.updateMany(
        {},
        { $pull: { plants: { plantId } } }
      );

      res.json({
        message: 'Planta eliminada permanentemente',
        plantId
      });

    } catch (error) {
      console.error('Error al eliminar planta permanentemente:', error);
      res.status(500).json({
        error: 'Error al eliminar la planta permanentemente'
      });
    }
  }

  // Reactivar planta
  static async reactivatePlant(req, res) {
    try {
      const { plantId } = req.params;

      const plant = await Plant.findByIdAndUpdate(
        plantId,
        { isActive: true },
        { new: true }
      );

      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      res.json({
        message: 'Planta reactivada exitosamente',
        plant
      });

    } catch (error) {
      console.error('Error al reactivar planta:', error);
      res.status(500).json({
        error: 'Error al reactivar la planta'
      });
    }
  }

  // ========== ESTADÍSTICAS GENERALES ==========

  static async getDashboardStats(req, res) {
    try {
      // Estadísticas de usuarios
      const allUsers = await UserModel.findAll();
      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter(u => u.isActive).length;
      const adminUsers = allUsers.filter(u => u.role === 'ADMIN').length;
      const usersWithSurvey = allUsers.filter(u => u.surveyCompleted).length;

      // Estadísticas de plantas
      const totalPlants = await Plant.countDocuments();
      const activePlants = await Plant.countDocuments({ isActive: true });
      const inactivePlants = await Plant.countDocuments({ isActive: false });

      // Estadísticas de favoritos
      const totalFavorites = await Favorite.countDocuments();

      // Estadísticas de recomendaciones
      const totalRecommendations = await Recommendation.countDocuments();

      // Plantas más populares (más favoritos)
      const popularPlants = await Favorite.aggregate([
        { $group: { _id: '$plantId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      const popularPlantsDetails = await Promise.all(
        popularPlants.map(async (p) => {
          const plant = await Plant.findById(p._id);
          return {
            plant: plant ? { _id: plant._id, name: plant.name, imageUrl: plant.imageUrl } : null,
            favoritesCount: p.count
          };
        })
      );

      res.json({
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers,
          withSurvey: usersWithSurvey,
          surveyCompletionRate: totalUsers > 0 ? ((usersWithSurvey / totalUsers) * 100).toFixed(2) : 0
        },
        plants: {
          total: totalPlants,
          active: activePlants,
          inactive: inactivePlants
        },
        engagement: {
          totalFavorites,
          totalRecommendations,
          avgFavoritesPerUser: totalUsers > 0 ? (totalFavorites / totalUsers).toFixed(2) : 0
        },
        popularPlants: popularPlantsDetails
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        error: 'Error al obtener estadísticas del dashboard'
      });
    }
  }
}

module.exports = AdminController;