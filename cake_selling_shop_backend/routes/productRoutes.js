const express = require('express');
const router = express.Router();
const { Product, Promotion } = require('../models');
const productController = require('../controllers/productController');

router.get('/get-all', productController.getAllProducts);
router.get('/get-by-id', productController.getProductById);

router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Promotion,
        through: { attributes: [] }
      }]
    });

    const formattedProducts = products.map(product => ({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id,
      status: product.status,
      created_at: product.created_at,
      updated_at: product.updated_at,
      promotions: product.Promotions.map(promotion => ({
        promotion_id: promotion.promotion_id,
        name: promotion.name,
        discount_percentage: promotion.discount_percentage,
        start_date: promotion.start_date,
        end_date: promotion.end_date
      }))
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
