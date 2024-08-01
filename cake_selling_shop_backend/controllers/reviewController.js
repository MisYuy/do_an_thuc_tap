const db = require('../models');
const Review = db.Review;
const User = db.User;
const Product = db.Product;

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;

    if (!user_id || !product_id || !rating) {
      return res.status(400).json({ error: 'User ID, Product ID, and Rating are required' });
    }

    const newReview = await Review.create({
      user_id,
      product_id,
      rating,
      comment,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Error creating review' });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['user_id', 'email', 'full_name', 'image'] },
        { model: Product, attributes: ['product_id', 'name'] }
      ]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findByPk(reviewId, {
      include: [
        { model: User, attributes: ['user_id', 'email', 'full_name'] },
        { model: Product, attributes: ['product_id', 'name'] }
      ]
    });

    if (review) {
      res.json(review);
    } else {
      return res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    res.status(500).json({ error: 'Error fetching review by ID' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.update({
      rating: rating || review.rating,
      comment: comment || review.comment,
      updated_at: new Date()
    });

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Error updating review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Error deleting review' });
  }
};
