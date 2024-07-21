const { Order, OrderItem, Product, User } = require('../models');

exports.getAllOrdersWithItems = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: OrderItem,
                required: true, // This ensures that only OrderItems with a valid Order are returned
                include: [{
                    model: Product,
                    attributes: ['product_id', 'name', 'description', 'price', 'stock_quantity', 'category_id', 'status', 'created_at', 'updated_at']
                }],
            },
            {
              model: User, // Include the User model
              attributes: ['user_id', 'email', 'full_name', 'phone_number', 'address', 'role', 'status'] // Specify the attributes you want to retrieve
          }]
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    const orderId = req.query.id; // Assuming the ID is passed as a URL parameter
    const { status } = req.body; // Expecting the new status from the request body

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Validate the status value
    const validStatuses = ['pending', 'shipping', 'completed', 'canceled']; // Define valid statuses
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status value. Use one of the following: ${validStatuses.join(', ')}.` });
    }

    // Update the order's status
    await order.update({
      status: status,
      updated_at: new Date()
    });

    console.log("Order status updated successfully:", order);
    res.json(order);
  } catch (error) {
    console.error('Error changing order status:', error);
    res.status(500).json({ error: error.message });
  }
};
