// Inventory Controller
const Inventory = require('./inventory.model.js');
const Product = require('../products/product.model.js');

// Get inventory by product ID
const getInventoryByProductId = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      where: { productId: req.params.id }
    });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update inventory quantity
const updateInventoryQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const inventory = await Inventory.findOne({
      where: { productId }
    });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    // Check if the update would result in negative stock
    if (inventory.stockQuantity + quantity < 0) {
      return res.status(400).json({ 
        error: 'Cannot reduce inventory below zero',
        currentStock: inventory.stockQuantity,
        requestedChange: quantity
      });
    }
    
    inventory.stockQuantity += quantity;
    const updatedInventory = await inventory.save();
    
    res.json(updatedInventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate inventory before sale
const validateInventoryBeforeSale = async (productId, quantity) => {
  try {
    const inventory = await Inventory.findOne({
      where: { productId }
    });
    
    if (!inventory) {
      throw new Error('Product inventory not found');
    }
    
    if (inventory.stockQuantity < quantity) {
      throw new Error(`Insufficient inventory. Available: ${inventory.stockQuantity}, Requested: ${quantity}`);
    }
    
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create inventory log entry
const createInventoryLog = async (req, res) => {
  try {
    const { productId, action, quantity, referenceId } = req.body;
    
    // Here we would typically create a log entry in a separate table
    // For now, we'll just return success
    res.status(201).json({ 
      message: 'Inventory log created successfully',
      productId,
      action,
      quantity,
      referenceId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory logs
const getInventoryLogs = async (req, res) => {
  try {
    // In a real implementation, this would query a logs table
    // For now, we'll return a placeholder
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInventoryByProductId,
  updateInventoryQuantity,
  validateInventoryBeforeSale,
  createInventoryLog,
  getInventoryLogs
};