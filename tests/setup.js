// Test setup file for global configurations
const mongoose = require('mongoose');

// Connect to in-memory MongoDB for testing
beforeAll(async () => {
  // Using a test database URL
  await mongoose.connect('mongodb://localhost:27017/test_minierp');
});

// Clear database after each test
afterEach(async () => {
  await mongoose.connection.db.dropCollection('products');
  await mongoose.connection.db.dropCollection('salesorders');
  await mongoose.connection.db.dropCollection('customers');
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});