const Product = require('./product.model');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'SKU must be unique' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Invalid product data', details: error.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product selling price
const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellingPrice } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.sellingPrice = sellingPrice;
    await product.save();

    return res.json(product);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Invalid selling price', details: error.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProductPrice
};