// Sales Order Controller
const SalesOrder = require('./sales-order.model.js');
const Customer = require('../customers/customer.model.js');
const Product = require('../products/product.model.js');

// Create a new sales order
const createSalesOrder = async (req, res) => {
  try {
    const { customerId, items } = req.body;

    // Validate customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    // Validate all products exist and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
      }

      // Check inventory availability
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          error: 'Insufficient inventory for product',
          productId: item.productId,
          available: product.stockQuantity,
          requested: item.quantity
        });
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

    // Create sales order
    const salesOrder = new SalesOrder({
      customerId,
      items: orderItems,
      totalAmount,
      status: 'pending'
    });

    const savedOrder = await salesOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales orders
const getAllSalesOrders = async (req, res) => {
  try {
    const salesOrders = await SalesOrder.find().populate('customerId', 'name email');
    res.json(salesOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sales order by ID
const getSalesOrderByById = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id).populate('customerId', 'name email');
    if (!salesOrder) {
      return res.status(404).json({ error: 'Sales order not found' });
    }
    res.json(salesOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm sales order and update inventory
const confirmSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) {
      return res.status(404).json({ error: 'Sales order not found' });
    }

    if (salesOrder.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be confirmed' });
    }

    // Update inventory for each item
    for (const item of salesOrder.items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.stockQuantity -= item.quantity;
        await product.save();
      }
    }

    // Update order status
    salesOrder.status = 'confirmed';
    const updatedOrder = await salesOrder.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete sales order and update inventory
const completeSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) {
      return res.status(404).json({ error: 'Sales order not found' });
    }

    if (salesOrder.status !== 'confirmed') {
      return res.status(400).json({ error: 'Only confirmed orders can be completed' });
    }

    // Update order status
    salesOrder.status = 'completed';
    const updatedOrder = await salesOrder.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderByById,
  confirmSalesOrder,
  completeSalesOrder
};