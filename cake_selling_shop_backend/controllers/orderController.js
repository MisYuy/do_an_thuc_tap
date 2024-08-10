// Create a new order
const { Order, OrderItem, Product, User, CartItem } = require('../models');
const axios = require('axios');

exports.getOrdersByUserId = async (req, res) => {
  try {
      const userId = req.query.id; // Assuming the user ID is passed as a URL parameter

      if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
      }

      const orders = await Order.findAll({
          where: { user_id: userId },
          include: [{
              model: OrderItem,
              required: true, // This ensures that only OrderItems with a valid Order are returned
              include: [{
                  model: Product,
                  attributes: ['product_id', 'name', 'description', 'price', 'stock_quantity', 'category_id', 'status', 'created_at', 'updated_at']
              }],
          }]
      });

      if (orders.length === 0) {
          return res.status(404).json({ error: 'No orders found for this user' });
      }

      res.json(orders);
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: error.message });
  }
};

exports.getAllOrdersWithItems = async (req, res) => {
  try {
      const orders = await Order.findAll({
          include: [
              {
                  model: OrderItem,
                  required: true,
                  include: [
                      {
                          model: Product,
                          attributes: ['product_id', 'name', 'description', 'price', 'stock_quantity', 'category_id', 'status', 'created_at', 'updated_at']
                      }
                  ]
              },
              {
                  model: User,
                  attributes: ['user_id', 'email', 'full_name', 'phone_number', 'address', 'role', 'status']
              },
              {
                  model: User,
                  as: 'ResponsibleUser',
                  attributes: ['user_id', 'email', 'full_name', 'phone_number', 'address', 'role', 'status']
              }
          ]
      });

      res.json(orders);
  } catch (error) {
    console.error("@@", error);
      res.status(500).json({ error: error.message });
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    const orderId = req.query.id; // Assuming the ID is passed as a URL parameter
    const { status, userId } = req.body; // Expecting the new status and userId from the request body

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const customer = await User.findByPk(order.user_id);
    if (!customer) {
        return res.status(404).json({ error: 'User not found' });
      }

    // Validate the status value
    const validStatuses = ['pending', 'shipping', 'completed', 'canceled']; // Define valid statuses
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status value. Use one of the following: ${validStatuses.join(', ')}.` });
    }

    // Update the order's status and id_responsible
    await order.update({
      status: status,
      updated_at: new Date(),
      id_responsible: userId
    });
    console.log("@@" + customer.email);

    if (status === 'completed' || status === 'shipping') {
      const formData = new URLSearchParams();
      formData.append('service_id', 'service_f8pe2cl');
      formData.append('template_id', 'template_9oorry7');
      formData.append('user_id', 'HXGYG1VBulNzebI2B');
      formData.append('accessToken', 'DT7lSHtH6iXTI6xS0qd5F');
      formData.append('email', customer.email);
      formData.append('status', status === 'completed' ? 'đã được giao thành công' : 'đang được giao tới bạn');
      formData.append('order_id', order.order_id);
      formData.append('total_amount', order.total_amount);
      formData.append('shipping_address', order.shipping_address);
      formData.append('shipping_date', order.updated_at);

      try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send-form', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        console.log('Verification code sent');
      } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email' });
      }
    }

    console.log("Order status updated successfully:", order);
    res.json(order);
  } catch (error) {
    console.error('Error changing order status:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.createOrder = async (req, res) => {
  try {
      const { user_id, total_amount, status, shippingAddress, notes, orderItems } = req.body;

      // Create the order
      const newOrder = await Order.create({
          user_id,
          total_amount,
          status,
          shipping_address: shippingAddress,
          created_at: new Date(),
          updated_at: new Date(),
          notes
      });

      // Create the order items
      const orderItemsData = orderItems.map(item => ({
          order_id: newOrder.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: new Date(),
          updated_at: new Date()
      }));

      await OrderItem.bulkCreate(orderItemsData);

      // Clear the user's cart
      await CartItem.destroy({ where: { user_id } });

      res.status(201).json(newOrder);
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
      const orderId = req.query.id; // Assuming the ID is passed as a URL parameter
      const { user_id, total_amount, status, notes, orderItems } = req.body;

      const order = await Order.findByPk(orderId);
      if (!order) {
          return res.status(404).json({ error: 'Order not found' });
      }

      // Update the order
      await order.update({
          user_id,
          total_amount,
          status,
          notes,
          updated_at: new Date()
      });

      // Update the order items
      if (orderItems && orderItems.length > 0) {
          // Delete existing order items
          await OrderItem.destroy({ where: { order_id: orderId } });

          // Create new order items
          const orderItemsData = orderItems.map(item => ({
              order_id: orderId,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              created_at: new Date(),
              updated_at: new Date()
          }));

          await OrderItem.bulkCreate(orderItemsData);
      }

      res.json(order);
  } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: error.message });
  }
};
