const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

router.get('/get-all', materialController.getAllMaterials);
router.get('/get-by-id', materialController.getMaterialById);
router.post('/add-new', materialController.createMaterial);
router.put('/update', materialController.updateMaterial);
router.delete('/delete', materialController.deleteMaterial);
router.post('/usage', materialController.createMaterialUsage);
router.get('/get-statistic', materialController.getMaterialStatistics);

module.exports = router;
