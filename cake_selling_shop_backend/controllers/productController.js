const { Product, Promotion } = require('../models');

exports.getAllProducts = async (req, res) => {
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
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.query.id;

        const product = await Product.findByPk(productId, {
            include: [{
                model: Promotion,
                through: { attributes: [] }
            }]
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const formattedProduct = {
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
        };

        return res.json(formattedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
