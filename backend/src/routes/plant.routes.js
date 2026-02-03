const express = require('express');
const PlantController = require('../controllers/plant.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get('/', PlantController.getAllPlants);
router.get('/:id', PlantController.getPlantById);

// Rutas protegidas (solo ADMIN)
router.post('/', 
  authMiddleware, 
  roleMiddleware('ADMIN'), 
  PlantController.createPlant
);

router.put('/:id', 
  authMiddleware, 
  roleMiddleware('ADMIN'), 
  PlantController.updatePlant
);

router.delete('/:id', 
  authMiddleware, 
  roleMiddleware('ADMIN'), 
  PlantController.deletePlant
);

router.delete('/:id/permanent', 
  authMiddleware, 
  roleMiddleware('ADMIN'), 
  PlantController.permanentDeletePlant
);

module.exports = router;