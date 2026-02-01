const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller.js');

// Get inventory by product ID
router.get('/products/:id', inventoryController.getInventoryByProductId);

// Update inventory quantity
router.put('/update', inventoryController.updateInventoryQuantity);

// Create inventory log
router.post('/logs', inventoryController.createInventoryLog);

// Get inventory logs
router.get('/logs', inventoryController.getInventoryLogs);

module.exports = router;