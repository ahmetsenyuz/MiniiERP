// Unit test suite for core business logic
const { calculateTotal } = require('../src/modules/sales-orders/sales-order.service.js');
const { validateProduct } = require('../src/modules/products/product.service.js');

describe('Business Logic Tests', () => {
  test('should calculate total amount correctly', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 3 }
    ];
    expect(calculateTotal(items)).toBe(350);
  });

  test('should validate product correctly', () => {
    const product = {
      name: 'Test Product',
      sku: 'TP001',
      sellingPrice: 100,
      stockQuantity: 10
    };
    expect(validateProduct(product)).toBe(true);
  });

  test('should reject invalid product data', () => {
    const product = {
      name: '',
      sku: 'TP001',
      sellingPrice: 100,
      stockQuantity: 10
    };
    expect(validateProduct(product)).toBe(false);
  });
});