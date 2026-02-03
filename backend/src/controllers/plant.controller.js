const Plant = require('../models/mongo/plant.model');

class PlantController {
  // Obtener todas las plantas (público)
  static async getAllPlants(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const query = { isActive: true };

      // Búsqueda por nombre
      if (search) {
        query.name = { $regex: search, $options: 'i' };
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
        error: 'Error al obtener las plantas'
      });
    }
  }

  // Obtener planta por ID
  static async getPlantById(req, res) {
    try {
      const { id } = req.params;

      const plant = await Plant.findById(id);

      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      res.json({ plant });

    } catch (error) {
      console.error('Error al obtener planta:', error);
      res.status(500).json({
        error: 'Error al obtener la planta'
      });
    }
  }

  // Crear planta (ADMIN)
  static async createPlant(req, res) {
    try {
      const plantData = req.body;

      // Validar campos requeridos
      if (!plantData.name || !plantData.description) {
        return res.status(400).json({
          error: 'name y description son requeridos'
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

  // Actualizar planta (ADMIN)
  static async updatePlant(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const plant = await Plant.findByIdAndUpdate(
        id,
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

  // Eliminar planta (soft delete - ADMIN)
  static async deletePlant(req, res) {
    try {
      const { id } = req.params;

      const plant = await Plant.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      res.json({
        message: 'Planta eliminada exitosamente',
        plant
      });

    } catch (error) {
      console.error('Error al eliminar planta:', error);
      res.status(500).json({
        error: 'Error al eliminar la planta'
      });
    }
  }

  // Eliminar permanentemente (ADMIN)
  static async permanentDeletePlant(req, res) {
    try {
      const { id } = req.params;

      const plant = await Plant.findByIdAndDelete(id);

      if (!plant) {
        return res.status(404).json({
          error: 'Planta no encontrada'
        });
      }

      res.json({
        message: 'Planta eliminada permanentemente'
      });

    } catch (error) {
      console.error('Error al eliminar planta permanentemente:', error);
      res.status(500).json({
        error: 'Error al eliminar la planta permanentemente'
      });
    }
  }
}

module.exports = PlantController;