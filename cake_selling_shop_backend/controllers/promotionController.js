// promotionController.js

const { Promotion, Product } = require('../models');

exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      include: [{
        model: Product,
        through: { attributes: [] }
      }]
    });

    const formattedPromotions = promotions.map(promotion => ({
      promotion_id: promotion.promotion_id,
      name: promotion.name,
      description: promotion.description,
      discount_percentage: promotion.discount_percentage,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      products: promotion.Products.map(product => ({
        product_id: product.product_id,
        name: product.name,
        price: product.price
      }))
    }));

    res.json(formattedPromotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionById = async (req, res) => {
  try {
    const promotionId = req.query.id;

    const promotion = await Promotion.findByPk(promotionId, {
      include: [{
        model: Product,
        through: { attributes: [] }
      }]
    });

    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const formattedPromotion = {
      promotion_id: promotion.promotion_id,
      name: promotion.name,
      description: promotion.description,
      discount_percentage: promotion.discount_percentage,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      products: promotion.Products.map(product => ({
        product_id: product.product_id,
        name: product.name,
        price: product.price
      }))
    };

    return res.json(formattedPromotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the promotion' });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const { name, description, discount_percentage, start_date, end_date } = req.body;

    const promotion = await Promotion.create({
      name,
      description,
      discount_percentage,
      start_date,
      end_date,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const { promotion_id, name, description, discount_percentage, start_date, end_date } = req.body;

    if (!promotion_id) {
      return res.status(400).json({ error: 'Promotion ID is required' });
    }

    const promotion = await Promotion.findByPk(promotion_id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    await promotion.update({
      name,
      description,
      discount_percentage,
      start_date,
      end_date,
      updated_at: new Date()
    });

    res.json(promotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.query.id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    await promotion.destroy();
    res.json({ message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
