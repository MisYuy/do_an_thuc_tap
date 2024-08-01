const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Middleware for authentication (if needed)
const authenticateToken = require('../middlewares/auth');

// Public routes
router.get('/get-all', reviewController.getAllReviews);
router.get('/get-by-id/:id', reviewController.getReviewById);

// Protected routes (require authentication)
router.use(authenticateToken);

router.post('/create-new', reviewController.createReview);
router.put('/update/:id', reviewController.updateReview);
router.delete('/delete/:id', reviewController.deleteReview);

module.exports = router;
