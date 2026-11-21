const test = require('node:test');
const assert = require('node:assert/strict');
const TieredShippingCalculator = require('../lib/tieredShippingCalculator');

test('Tiered Shipping Calculator Tests', async (t) => {
  await t.test('should award free shipping for domestic orders over $75', () => {
    const res = TieredShippingCalculator.calculateShipping(80.0, 2.5, 'US');
    assert.equal(res.shippingFee, 0.0);
    assert.equal(res.isFreeShipping, true);
  });

  await t.test('should charge international shipping rate based on weight', () => {
    // International base $18.50 + 2 kg * $6 = $30.50
    const res = TieredShippingCalculator.calculateShipping(50.0, 2.0, 'DE');
    assert.equal(res.shippingFee, 30.50);
    assert.equal(res.isFreeShipping, false);
  });
});
