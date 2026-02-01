// End-to-end tests for complete user journeys
const request = require('supertest');
const app = require('../src/index.js');
const mongoose = require('mongoose');
const Product = require('../src/modules/products/product.model.js');
const SalesOrder = require('../src/modules/sales-orders/sales-order.model.js');
const Customer = require('../src/modules/customers/customer.model.js');

describe('End-to-End User Journeys', () => {
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
    await Customer.deleteMany({});
  });

  describe('Complete Sales Order Process', () => {
    it('should complete a full sales order workflow', async () => {
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

      // Verify order was created
      expect(response.body.customerId).toBe(customer._id.toString());
      expect(response.body.totalAmount).toBe(200);
      expect(response.body.status).toBe('pending');

      // Confirm the sales order
      const confirmResponse = await request(app)
        .put(`/api/sales-orders/${response.body._id}/confirm`)
        .expect(200);

      expect(confirmResponse.body.status).toBe('confirmed');

      // Check if inventory was reduced
      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct.stockQuantity).toBe(8);
    });
  });
});