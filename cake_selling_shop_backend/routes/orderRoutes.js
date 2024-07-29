const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/get-all', orderController.getAllOrdersWithItems);

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

router.get('/get-all-by-user-id', orderController.getOrdersByUserId);
router.put('/change-status', orderController.changeOrderStatus);
router.post('/create', orderController.createOrder);
router.put('/update', orderController.updateOrder);

module.exports = router;
