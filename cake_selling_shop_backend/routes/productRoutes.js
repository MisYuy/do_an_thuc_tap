const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/get-all', productController.getAllProducts);
router.get('/get-by-id', productController.getProductById);
router.post('/add-new', productController.createProduct);

module.exports = router;
