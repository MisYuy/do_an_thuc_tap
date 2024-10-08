const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const order = require('./routes/orderRoutes');
const promotion = require('./routes/promotionRoutes');
const category = require('./routes/categoryRoutes');
const material = require('./routes/materialRoutes');
const orderMaterial = require('./routes/materialOrderRoutes');
const statistics = require('./routes/statisticsRoutes');
const reviews = require('./routes/reviewRoutes');
const email = require('./routes/emailRoutes');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // Use CORS middleware

// Register your routes
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', order);
app.use('/api/promotion', promotion);
app.use('/api/category', category);
app.use('/api/material', material);
app.use('/api/order-material', orderMaterial);
app.use('/api/statistic', statistics);
app.use('/api/reviews', reviews);

app.use('/api/email', email);

// Start the server
const PORT = process.env.PORT || 3500;
const HOST = '0.0.0.0'; // Bind to all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
