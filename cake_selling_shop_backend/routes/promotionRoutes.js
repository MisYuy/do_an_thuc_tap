const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

const authenticateToken = require('../middlewares/auth'); 
router.use(authenticateToken);

router.get('/get-all', promotionController.getAllPromotions);
router.get('/get-by-id', promotionController.getPromotionById);
router.post('/add-new', promotionController.createPromotion);
router.put('/update', promotionController.updatePromotion);
router.delete('/delete', promotionController.deletePromotion);

module.exports = router;
