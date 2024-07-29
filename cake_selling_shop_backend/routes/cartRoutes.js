const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

router.get('/get-all', cartController.getAllCartItems);
router.put('/add-product', cartController.addProductToCart);
router.put('/update-cart-item', cartController.updateCartItem); // Ensure this matches the frontend request

module.exports = router;
