// Purchase Order Controller
const PurchaseOrder = require('./purchase-order.model');
const Supplier = require('../suppliers');
const Product = require('../products/product.model');

// Create a new purchase order
const createPurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items } = req.body;

    // Validate supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    // Validate all products exist and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }

    // Create purchase order
    const purchaseOrder = new PurchaseOrder({
      supplierId,
      items: orderItems,
      totalAmount,
      status: 'pending'
    });

    const savedOrder = await purchaseOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all purchase orders
const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find().populate('supplierId', 'name');
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get purchase order by ID
const getPurchaseOrderById = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate('supplierId', 'name');
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm purchase order and update inventory
const confirmPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    if (purchaseOrder.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be confirmed' });
    }

    // Update inventory for each item
    for (const item of purchaseOrder.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity += item.quantity;
        await product.save();
      }
    }

    // Update order status
    purchaseOrder.status = 'confirmed';
    const updatedOrder = await purchaseOrder.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  confirmPurchaseOrder
};