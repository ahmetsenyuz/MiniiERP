const request = require('supertest');
const app = require('../src/index.js');
const mongoose = require('mongoose');
const SalesOrder = require('../src/modules/sales-orders/sales-order.model.js');
const Product = require('../src/modules/products/product.model.js');
const Customer = require('../src/modules/customers/customer.model.js');

describe('Sales Orders API', () => {
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
    await SalesOrder.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
  });

  describe('POST /api/sales-orders', () => {
    it('should create a new sales order with valid data', async () => {
      // Create a customer
      const customer = await Customer.create({
        name: 'John Doe',
        email: 'john@example.com'
      });

      // Create a product
      const product = await Product.create({
        name: 'Test Product',
        sku: 'TP001',
        sellingPrice: 100,
        stockQuantity: 10
      });

      const salesOrderData = {
        customerId: customer._id,
        items: [
          {
            productId: product._id,
            quantity: 2,
            price: 100
          }
        ]
      };

      const response = await request(app)
        .post('/api/sales-orders')
        .send(salesOrderData)
        .expect(201);

      expect(response.body.customerId).toBe(customer._id.toString());
      expect(response.body.totalAmount).toBe(200);
      expect(response.body.status).toBe('pending');
    });

    it('should return error for insufficient inventory', async () => {
      // Create a customer
      const customer = await Customer.create({
        name: 'John Doe',
        email: 'john@example.com'
      });

      // Create a product with low inventory
      const product = await Product.create({
        name: 'Test Product',
        sku: 'TP001',
        sellingPrice: 100,
        stockQuantity: 1
      });

      const salesOrderData = {
        customerId: customer._id,
        items: [
          {
            productId: product._id,
            quantity: 5,
            price: 100
          }
        ]
      };

      const response = await request(app)
        .post('/api/sales-orders')
        .send(salesOrderData)
        .expect(400);

      expect(response.body.error).toContain('Insufficient inventory');
    });
  });

  describe('GET /api/sales-orders', () => {
    it('should return all sales orders', async () => {
      // Create a customer
      const customer = await Customer.create({
        name: 'John Doe',
        email: 'john@example.com'
      });

      // Create a product
      const product = await Product.create({
        name: 'Test Product',
        sku: 'TP001',
        sellingPrice: 100,
        stockQuantity: 10
      });

      // Create a sales order
      await SalesOrder.create({
        customerId: customer._id,
        items: [
          {
            productId: product._id,
            quantity: 2,
            price: 100,
            total: 200
          }
        ],
        totalAmount: 200,
        status: 'pending'
      });

      const response = await request(app)
        .get('/api/sales-orders')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].status).toBe('pending');
    });
  });

  describe('PUT /api/sales-orders/:id/confirm', () => {
    it('should confirm a sales order and reduce inventory', async () => {
      // Create a customer
      const customer = await Customer.create({
        name: 'John Doe',
        email: 'john@example.com'
      });

      // Create a product
      const product = await Product.create({
        name: 'Test Product',
        sku: 'TP001',
        sellingPrice: 100,
        stockQuantity: 10
      });

      // Create a sales order
      const salesOrder = await SalesOrder.create({
        customerId: customer._id,
        items: [
          {
            productId: product._id,
            quantity: 2,
            price: 100,
            total: 200
          }
        ],
        totalAmount: 200,
        status: 'pending'
      });

      const response = await request(app)
        .put(`/api/sales-orders/${salesOrder._id}/confirm`)
        .expect(200);

      expect(response.body.status).toBe('confirmed');
      
      // Check if inventory was reduced
      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct.stockQuantity).toBe(8);
    });
  });
});