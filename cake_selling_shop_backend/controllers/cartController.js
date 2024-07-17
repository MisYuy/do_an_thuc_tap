const { CartItem, Product } = require('../models');

exports.createCartItem = async (req, res) => {
    try {
      const cartItem = await CartItem.create(req.body);
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getAllCartItems = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId query parameter is required" });
    }

    const cartItems = await CartItem.findAll({
      where: {
        user_id: userId
      },
      include: [{
        model: Product,
        attributes: ['product_id', 'name', 'description', 'price', 'stock_quantity', 'category_id', 'status', 'created_at', 'updated_at']
      }]
    });

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.addProductToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      let cartItem = await CartItem.findOne({
        where: {
            user_id: userId,
            product_id: productId
        }
      });
  
      if (cartItem) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới CartItem
        cartItem = await CartItem.create({
          user_id: userId,
          product_id: productId,
          quantity: quantity,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
  
      res.json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
      }
  };
  