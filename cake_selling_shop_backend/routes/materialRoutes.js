const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/get-all', materialController.getAllMaterials);
router.get('/get-by-id', materialController.getMaterialById);
router.post('/add-new', materialController.createMaterial);
router.put('/update', materialController.updateMaterial);
router.delete('/delete', materialController.deleteMaterial);

module.exports = router;
