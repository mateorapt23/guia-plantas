const SurveyModel = require('../models/sql/survey.model');
const UserModel = require('../models/sql/user.model');

class SurveyController {
  // Completar encuesta
  static async completeSurvey(req, res) {
    try {
      const userId = req.user.userId;
      const {
        experience,
        sunlight,
        space,
        petFriendly,
        maintenanceLevel,
        climate,
        purpose
      } = req.body;

      // Validar campos requeridos
      if (!experience || !sunlight || !space || maintenanceLevel === undefined) {
        return res.status(400).json({
          error: 'Los campos experience, sunlight, space y maintenanceLevel son requeridos'
        });
      }

      // Validar valores permitidos
      const validExperience = ['beginner', 'intermediate', 'expert'];
      const validSunlight = ['low', 'medium', 'high'];
      const validSpace = ['small', 'medium', 'large'];
      const validMaintenance = ['low', 'medium', 'high'];

      if (!validExperience.includes(experience)) {
        return res.status(400).json({
          error: 'experience debe ser: beginner, intermediate o expert'
        });
      }

      if (!validSunlight.includes(sunlight)) {
        return res.status(400).json({
          error: 'sunlight debe ser: low, medium o high'
        });
      }

      if (!validSpace.includes(space)) {
        return res.status(400).json({
          error: 'space debe ser: small, medium o large'
        });
      }

      if (!validMaintenance.includes(maintenanceLevel)) {
        return res.status(400).json({
          error: 'maintenanceLevel debe ser: low, medium o high'
        });
      }

      // Verificar si el usuario ya completó la encuesta
      const existingSurvey = await SurveyModel.findByUserId(userId);
      if (existingSurvey) {
        return res.status(400).json({
          error: 'Ya has completado la encuesta',
          survey: existingSurvey
        });
      }

      // Crear encuesta
      const survey = await SurveyModel.create({
        userId,
        experience,
        sunlight,
        space,
        petFriendly: petFriendly || false,
        maintenanceLevel,
        climate: climate || null,
        purpose: purpose || null
      });

      // Actualizar el campo surveyCompleted del usuario
      await UserModel.updateSurveyCompleted(userId, true);

      res.status(201).json({
        message: 'Encuesta completada exitosamente',
        survey: {
          id: survey.id,
          experience: survey.experience,
          sunlight: survey.sunlight,
          space: survey.space,
          petFriendly: survey.petFriendly,
          maintenanceLevel: survey.maintenanceLevel,
          climate: survey.climate,
          purpose: survey.purpose,
          createdAt: survey.createdAt
        }
      });

    } catch (error) {
      console.error('Error al completar encuesta:', error);
      res.status(500).json({
        error: 'Error al completar la encuesta'
      });
    }
  }

  // Obtener encuesta del usuario
  static async getSurvey(req, res) {
    try {
      const userId = req.user.userId;

      const survey = await SurveyModel.findByUserId(userId);

      if (!survey) {
        return res.status(404).json({
          error: 'No has completado la encuesta aún'
        });
      }

      res.json({
        survey: {
          id: survey.id,
          experience: survey.experience,
          sunlight: survey.sunlight,
          space: survey.space,
          petFriendly: survey.petFriendly,
          maintenanceLevel: survey.maintenanceLevel,
          climate: survey.climate,
          purpose: survey.purpose,
          createdAt: survey.createdAt
        }
      });

    } catch (error) {
      console.error('Error al obtener encuesta:', error);
      res.status(500).json({
        error: 'Error al obtener la encuesta'
      });
    }
  }

  // Verificar si el usuario completó la encuesta
  static async checkSurveyStatus(req, res) {
    try {
      const userId = req.user.userId;

      const exists = await SurveyModel.exists(userId);

      res.json({
        surveyCompleted: exists
      });

    } catch (error) {
      console.error('Error al verificar encuesta:', error);
      res.status(500).json({
        error: 'Error al verificar el estado de la encuesta'
      });
    }
  }
}

module.exports = SurveyController;