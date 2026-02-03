const express = require('express');
const AdminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación y rol ADMIN
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

// ========== DASHBOARD ==========
router.get('/dashboard', AdminController.getDashboardStats);

// ========== GESTIÓN DE USUARIOS ==========
router.get('/users', AdminController.getAllUsers);
router.get('/users/:userId', AdminController.getUserDetails);
router.put('/users/:userId/role', AdminController.changeUserRole);
router.put('/users/:userId/status', AdminController.toggleUserStatus);

// ========== GESTIÓN DE PLANTAS ==========
router.get('/plants', AdminController.getAllPlantsAdmin);
router.post('/plants', AdminController.createPlantAdmin);
router.put('/plants/:plantId', AdminController.updatePlantAdmin);
router.delete('/plants/:plantId', AdminController.deletePlantAdmin);
router.delete('/plants/:plantId/permanent', AdminController.permanentDeletePlantAdmin);
router.put('/plants/:plantId/reactivate', AdminController.reactivatePlant);

module.exports = router;