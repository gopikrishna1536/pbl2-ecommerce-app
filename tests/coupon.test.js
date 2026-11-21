const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { CouponEngine } = require('../lib/couponEngine');

describe('Promotional Coupon & Discount Calculation Tests', () => {
  const sampleCart = {
    items: [
      { sku: 'TEE-BLK', name: 'Cotton T-Shirt', price: 25.0, quantity: 2 }, // $50
      { sku: 'HOODIE', name: 'Fleece Hoodie', price: 60.0, quantity: 1 }     // $60 -> Total = $110
    ]
  };

  test('should apply 20% discount with percentage coupon', () => {
    const coupon = {
      code: 'FLASH20',
      type: 'PERCENTAGE',
      value: 20
    };

    const res = CouponEngine.applyCoupon(coupon, sampleCart);
    assert.equal(res.success, true);
    assert.equal(res.subtotal, 110);
    assert.equal(res.discountAmount, 22); // 20% of 110
    assert.equal(res.finalTotal, 88);
    assert.equal(res.savingsPercentage, 20);
  });

  test('should respect max discount cap on percentage coupon', () => {
    const coupon = {
      code: 'MEGA50',
      type: 'PERCENTAGE',
      value: 50,
      maxDiscountCap: 30.0 // 50% would be $55, but capped at $30
    };

    const res = CouponEngine.applyCoupon(coupon, sampleCart);
    assert.equal(res.discountAmount, 30.0);
    assert.equal(res.finalTotal, 80.0);
  });

  test('should apply fixed dollar coupon', () => {
    const coupon = {
      code: 'SAVE15',
      type: 'FIXED_AMOUNT',
      value: 15.0
    };

    const res = CouponEngine.applyCoupon(coupon, sampleCart);
    assert.equal(res.discountAmount, 15.0);
    assert.equal(res.finalTotal, 95.0);
  });

  test('should reject coupon when minimum subtotal requirement is not met', () => {
    const coupon = {
      code: 'VIP200',
      type: 'PERCENTAGE',
      value: 25,
      minSubtotal: 200.0 // Cart is only $110
    };

    const res = CouponEngine.applyCoupon(coupon, sampleCart);
    assert.equal(res.success, false);
    assert.equal(res.discountAmount, 0);
    assert.ok(res.error.includes('must be at least $200.00'));
  });

  test('should reject expired coupon', () => {
    const coupon = {
      code: 'EXPIRED10',
      type: 'PERCENTAGE',
      value: 10,
      expiresAt: '2025-01-01T00:00:00Z'
    };

    const res = CouponEngine.applyCoupon(coupon, sampleCart, new Date('2026-01-01'));
    assert.equal(res.success, false);
    assert.equal(res.error, 'Coupon code has expired');
  });

  test('should calculate BOGO (Buy 2 Get 1 Free) discount', () => {
    const bogoCart = {
      items: [
        { sku: 'TEE-BLK', name: 'Cotton T-Shirt', price: 25.0, quantity: 3 } // 3 units -> 1 free ($25)
      ]
    };

    const coupon = {
      code: 'BOGO-TEE',
      type: 'BOGO',
      targetSku: 'TEE-BLK'
    };

    const res = CouponEngine.applyCoupon(coupon, bogoCart);
    assert.equal(res.success, true);
    assert.equal(res.discountAmount, 25.0);
    assert.equal(res.finalTotal, 50.0);
  });
});
