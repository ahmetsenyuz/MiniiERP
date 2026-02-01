// Integration tests for API endpoints and database interactions
const request = require('supertest');
const app = require('../src/index.js');
const mongoose = require('mongoose');
const Product = require('../src/modules/products/product.model.js');
const SalesOrder = require('../src/modules/sales-orders/sales-order.model.js');

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test_minierp');
  });

  afterAll(async () => {
    // Clean up database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await Product.deleteMany({});
    await SalesOrder.deleteMany({});
  });

  describe('POST /api/products', () => {
    it('should create a new product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        sku: 'TP001',
        sellingPrice: 100,
        stockQuantity: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body.name).toBe(productData.name);
      expect(response.body.sku).toBe(productData.sku);
      expect(response.body.stockQuantity).toBe(productData.stockQuantity);
    });

    it('should return error for invalid product data', async () => {
      const productData = {
        name: '',
        sku: 'TP001',
        sellingPrice: 100,
        stockQuantity: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Create a product
      await Product.create({
        name: 'Test Product',
        sku: 'TP001',
        sellingPrice: 100,
        stockQuantity: 10
      });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Test Product');
    });
  });
});