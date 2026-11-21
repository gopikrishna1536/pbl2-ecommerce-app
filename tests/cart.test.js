const { test, describe } = require('node:test');
const assert = require('node:assert');
const { calculateCartTotals } = require('../lib/cartEngine');

describe('E-Commerce Cart Pricing & Calculation Engine', () => {
  const mockProducts = [
    { id: 'p1', name: 'Keyboard', price: 100.0, stock: 10 },
    { id: 'p2', name: 'Mouse', price: 50.0, stock: 5 },
    { id: 'p3', name: 'Headphones', price: 200.0, stock: 2 }
  ];

  test('should calculate correct subtotal, tax (8%), and free shipping (>150)', () => {
    const items = [
      { productId: 'p1', quantity: 1 }, // 100
      { productId: 'p2', quantity: 2 }  // 100
    ];

    const result = calculateCartTotals(mockProducts, items);
    assert.strictEqual(result.subtotal, 200.0);
    assert.strictEqual(result.tax, 16.0); // 8% of 200
    assert.strictEqual(result.shipping, 0.0); // Free shipping over $150
    assert.strictEqual(result.finalTotal, 216.0);
  });

  test('should apply 20% discount on valid promo code WELCOME20', () => {
    const items = [{ productId: 'p1', quantity: 1 }]; // 100

    const result = calculateCartTotals(mockProducts, items, 'welcome20');
    assert.strictEqual(result.subtotal, 100.0);
    assert.strictEqual(result.discount.amount, 20.0);
    assert.strictEqual(result.discount.code, 'WELCOME20');

    // Discounted subtotal: 80.0
    // Tax: 80 * 0.08 = 6.40
    // Shipping: subtotal <= 150 so 9.99
    // Final: 80 + 6.40 + 9.99 = 96.39
    assert.strictEqual(result.tax, 6.4);
    assert.strictEqual(result.shipping, 9.99);
    assert.strictEqual(result.finalTotal, 96.39);
  });

  test('should throw error when requested quantity exceeds available stock', () => {
    const items = [{ productId: 'p3', quantity: 5 }]; // available stock is 2

    assert.throws(
      () => calculateCartTotals(mockProducts, items),
      /Insufficient stock for Headphones/
    );
  });

  test('should throw error on non-positive quantities', () => {
    const items = [{ productId: 'p1', quantity: 0 }];

    assert.throws(
      () => calculateCartTotals(mockProducts, items),
      /Quantity for Keyboard must be greater than zero/
    );
  });
});
