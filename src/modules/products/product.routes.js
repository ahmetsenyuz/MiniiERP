const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProductPrice } = require('./product.controller');

// Create a new product
router.post('/', createProduct);

// Get all products
router.get('/', getAllProducts);

// Update product selling price
router.put('/:id', updateProductPrice);

module.exports = router;