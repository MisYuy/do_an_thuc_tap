const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/get-all', productController.getAllProducts);
router.get('/get-by-id', productController.getProductById);

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

router.post('/add-new', productController.createProduct);
router.put('/update', productController.updateProduct);
router.put('/delete', productController.deleteProduct);

module.exports = router;
