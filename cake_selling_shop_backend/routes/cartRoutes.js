const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/get-all', cartController.getAllCartItems);
router.put('/add-product', cartController.addProductToCart);

module.exports = router;
