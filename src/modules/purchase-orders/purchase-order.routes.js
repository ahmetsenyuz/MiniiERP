// Purchase Order Routes
const express = require('express');
const router = express.Router();
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  confirmPurchaseOrder
} = require('./purchase-order.controller');

// Create a new purchase order
router.post('/', createPurchaseOrder);

// Get all purchase orders
router.get('/', getAllPurchaseOrders);

// Get purchase order by ID
router.get('/:id', getPurchaseOrderById);

// Confirm purchase order
router.put('/:id/confirm', confirmPurchaseOrder);

module.exports = router;