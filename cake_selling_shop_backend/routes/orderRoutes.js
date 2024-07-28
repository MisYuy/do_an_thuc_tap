const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/get-all', orderController.getAllOrdersWithItems);

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

router.put('/change-status', orderController.changeOrderStatus);

module.exports = router;
