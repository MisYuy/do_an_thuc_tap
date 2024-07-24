const { Product, Promotion, ProductPromotion } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Absolute path to the directory where images will be stored
const imageDirectory = 'D:\\do_an_thuc_tap\\cake_selling_shop\\public\\images\\product';

// Ensure the directory exists
if (!fs.existsSync(imageDirectory)) {
  fs.mkdirSync(imageDirectory, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        delete: 0 // Exclude products where delete = 1
      },
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
      image: product.image,
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
      image: product.image,
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
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const { name, description, price, category_id, stock_quantity, promotions } = req.body;
      const image = req.file ? req.file.filename : null;

      let status = 'out of stock';
      if (stock_quantity > 0 && stock_quantity <= 10)
        status = 'low of stock';
      else
        status = 'available';

      const product = await Product.create({
        name,
        description,
        price,
        stock_quantity,
        category_id,
        status,
        image: image
      });

      // Handle promotions
      if (promotions) {
        const promotionIds = JSON.parse(promotions);
        for (const promotionId of promotionIds) {
          await ProductPromotion.create({
            product_id: product.product_id,
            promotion_id: promotionId,
            created_at: new Date(), // Adjust as necessary
            updated_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // Adjust as necessary
          });
        }
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.updateProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const { product_id, name, description, price, stock_quantity, category, promotions } = req.body;

      if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const image = req.file ? req.file.filename : product.image;
      console.log("Image filename:", image);

      let status = 'out of stock';
      if (stock_quantity > 0 && stock_quantity <= 10)
        status = 'low of stock';
      else
        status = 'available';

      await product.update({
        name: name,
        description: description,
        price: price,
        stock_quantity: stock_quantity,
        category_id: category,
        image: image,
        status,
        updated_at: new Date()
      });

      // Update promotions
      if (promotions) {
        // Remove existing promotions
        await ProductPromotion.destroy({ where: { product_id: product_id } });

        // Add new promotions
        const promotionIds = JSON.parse(promotions);
        for (const promotionId of promotionIds) {
          await ProductPromotion.create({
            product_id: product_id,
            promotion_id: promotionId,
            created_at: new Date(), // Adjust as necessary
            updated_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // Adjust as necessary
          });
        }
      }

      console.log("Product updated successfully:", product);
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.query.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({
      delete: 1
    });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
