const Recommendation = require('../models/mongo/recommendation.model');
const Plant = require('../models/mongo/plant.model');
const SurveyModel = require('../models/sql/survey.model');

class RecommendationController {
  // Algoritmo de matching
  static calculateMatch(survey, plant) {
    let score = 0;
    const reasons = [];
    
    // Factor 1: Nivel de experiencia (peso: 25%)
    if (survey.experience === plant.care.difficulty) {
      score += 25;
      reasons.push(`Perfecta para tu nivel: ${survey.experience}`);
    } else if (
      (survey.experience === 'beginner' && plant.care.difficulty === 'intermediate') ||
      (survey.experience === 'intermediate' && plant.care.difficulty === 'beginner')
    ) {
      score += 15;
      reasons.push(`Adecuada para tu nivel de experiencia`);
    }
    
    // Factor 2: Luz solar (peso: 30%)
    if (survey.sunlight === plant.care.sunlight) {
      score += 30;
      reasons.push(`Se adapta a tu nivel de luz: ${survey.sunlight}`);
    } else {
      const sunlightLevels = { low: 1, medium: 2, high: 3 };
      const diff = Math.abs(sunlightLevels[survey.sunlight] - sunlightLevels[plant.care.sunlight]);
      if (diff === 1) {
        score += 15;
        reasons.push(`Puede adaptarse a tu luz`);
      }
    }
    
    // Factor 3: Nivel de mantenimiento (peso: 25%)
    if (survey.maintenanceLevel === plant.care.maintenance) {
      score += 25;
      reasons.push(`Mantenimiento ${survey.maintenanceLevel} como prefieres`);
    } else {
      const maintenanceLevels = { low: 1, medium: 2, high: 3 };
      const diff = Math.abs(maintenanceLevels[survey.maintenanceLevel] - maintenanceLevels[plant.care.maintenance]);
      if (diff === 1) {
        score += 12;
        reasons.push(`Mantenimiento similar al que buscas`);
      }
    }
    
    // Factor 4: Espacio (peso: 10%)
    if (survey.space === plant.size) {
      score += 10;
      reasons.push(`Tamaño ${plant.size} ideal para tu espacio`);
    } else if (
      (survey.space === 'large' && plant.size === 'medium') ||
      (survey.space === 'medium' && (plant.size === 'small' || plant.size === 'large'))
    ) {
      score += 5;
      reasons.push(`Puede adaptarse a tu espacio`);
    }
    
    // Factor 5: Pet friendly (peso: 10%)
    if (survey.petFriendly && plant.petFriendly) {
      score += 10;
      reasons.push(`✅ Segura para mascotas`);
    } else if (survey.petFriendly && !plant.petFriendly) {
      score -= 5;
      reasons.push(`⚠️ No recomendada si tienes mascotas`);
    }
    
    // Bonus: Clima
    if (survey.climate && plant.climate && plant.climate.includes(survey.climate)) {
      score += 5;
      reasons.push(`Prospera en clima ${survey.climate}`);
    }
    
    // Normalizar score (no puede ser negativo ni mayor a 100)
    score = Math.max(0, Math.min(100, score));
    
    return { score, reasons };
  }

  // Generar recomendaciones
  static async generateRecommendations(req, res) {
    try {
      const userId = req.user.userId;

      // Verificar que el usuario completó la encuesta
      const survey = await SurveyModel.findByUserId(userId);
      
      if (!survey) {
        return res.status(400).json({
          error: 'Debes completar la encuesta primero',
          redirect: '/api/survey/complete'
        });
      }

      // Obtener todas las plantas activas
      const plants = await Plant.find({ isActive: true });

      if (plants.length === 0) {
        return res.status(404).json({
          error: 'No hay plantas disponibles en este momento'
        });
      }

      // Calcular match para cada planta
      const matches = plants.map(plant => {
        const { score, reasons } = RecommendationController.calculateMatch(survey, plant);
        return {
          plantId: plant._id,
          matchScore: score,
          matchReasons: reasons,
          plant: plant
        };
      });

      // Ordenar por score descendente y tomar top 10
      matches.sort((a, b) => b.matchScore - a.matchScore);
      const topMatches = matches.slice(0, 10);

      // Guardar o actualizar recomendaciones
      const recommendationData = {
        userId,
        plants: topMatches.map(m => ({
          plantId: m.plantId,
          matchScore: m.matchScore,
          matchReasons: m.matchReasons
        })),
        surveyData: {
          experience: survey.experience,
          sunlight: survey.sunlight,
          space: survey.space,
          petFriendly: survey.petFriendly,
          maintenanceLevel: survey.maintenanceLevel,
          climate: survey.climate,
          purpose: survey.purpose
        }
      };

      await Recommendation.findOneAndUpdate(
        { userId },
        recommendationData,
        { upsert: true, new: true }
      );

      // Retornar recomendaciones con información completa de las plantas
      const recommendations = topMatches.map(m => ({
        plant: {
          _id: m.plant._id,
          name: m.plant.name,
          scientificName: m.plant.scientificName,
          description: m.plant.description,
          imageUrl: m.plant.imageUrl,
          care: m.plant.care,
          size: m.plant.size,
          petFriendly: m.plant.petFriendly,
          airPurifying: m.plant.airPurifying,
          benefits: m.plant.benefits,
          tips: m.plant.tips
        },
        matchScore: m.matchScore,
        matchReasons: m.matchReasons
      }));

      res.json({
        message: 'Recomendaciones generadas exitosamente',
        totalRecommendations: recommendations.length,
        recommendations
      });

    } catch (error) {
      console.error('Error al generar recomendaciones:', error);
      res.status(500).json({
        error: 'Error al generar recomendaciones'
      });
    }
  }

  // Obtener recomendaciones guardadas
  static async getMyRecommendations(req, res) {
    try {
      const userId = req.user.userId;

      const recommendation = await Recommendation.findOne({ userId })
        .populate('plants.plantId');

      if (!recommendation) {
        return res.status(404).json({
          error: 'No tienes recomendaciones. Genera nuevas recomendaciones primero.',
          action: 'POST /api/recommendations/generate'
        });
      }

      // Formatear respuesta
      const recommendations = recommendation.plants.map(p => ({
        plant: p.plantId,
        matchScore: p.matchScore,
        matchReasons: p.matchReasons
      }));

      res.json({
        recommendations,
        generatedAt: recommendation.generatedAt,
        surveyData: recommendation.surveyData
      });

    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      res.status(500).json({
        error: 'Error al obtener recomendaciones'
      });
    }
  }

  // Regenerar recomendaciones (si cambió la encuesta)
  static async regenerateRecommendations(req, res) {
    try {
      const userId = req.user.userId;

      // Eliminar recomendaciones anteriores
      await Recommendation.findOneAndDelete({ userId });

      // Generar nuevas
      return RecommendationController.generateRecommendations(req, res);

    } catch (error) {
      console.error('Error al regenerar recomendaciones:', error);
      res.status(500).json({
        error: 'Error al regenerar recomendaciones'
      });
    }
  }
}

module.exports = RecommendationController;