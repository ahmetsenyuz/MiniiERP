// Main application entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MiniiERP API' });
});

// Product routes
const productRoutes = require('./modules/products/product.routes.js');
app.use('/api/products', productRoutes);

// Purchase order routes
const purchaseOrderRoutes = require('./modules/purchase-orders/purchase-order.routes.js');
app.use('/api/purchase-orders', purchaseOrderRoutes);

// Sales order routes
const salesOrderRoutes = require('./modules/sales-orders/sales-order.routes.js');
app.use('/api/sales-orders', salesOrderRoutes);

// Dashboard routes
const dashboardRoutes = require('./modules/dashboard/dashboard.routes.js');
app.use('/api/dashboard', dashboardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;