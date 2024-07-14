const { CartItem } = require('../models');

exports.createCartItem = async (req, res) => {
    try {
      const cartItem = await CartItem.create(req.body);
      res.json(cartItem);
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
  