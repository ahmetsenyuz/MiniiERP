// Sales Order Routes
const express = require('express');
const router = express.Router();
const {
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderById,
  confirmSalesOrder,
  completeSalesOrder
} = require('./sales-order.controller');

// Create a new sales order
router.post('/', createSalesOrder);

// Get all sales orders
router.get('/', getAllSalesOrders);

// Get sales order by ID
router.get('/:id', getSalesOrderById);

// Confirm sales order (reduces inventory)
router.put('/:id/confirm', confirmSalesOrder);

// Complete sales order
router.put('/:id/complete', completeSalesOrder);

module.exports = router;