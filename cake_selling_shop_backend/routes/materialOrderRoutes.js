const express = require('express');
const router = express.Router();
const materialOrderController = require('../controllers/materialOrderController');

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

// Route to get all material orders
router.get('/get-all', materialOrderController.getAllMaterialOrders);

// Route to get a material order by ID
router.get('/get-by-id', materialOrderController.getMaterialOrderById);

// Route to create a new material order
router.post('/add-new', materialOrderController.createMaterialOrder);

// Route to update an existing material order
router.put('/update', materialOrderController.updateMaterialOrder);

// Route to delete a material order
router.delete('/delete', materialOrderController.deleteMaterialOrder);

module.exports = router;
