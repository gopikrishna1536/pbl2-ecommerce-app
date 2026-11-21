const test = require('node:test');
const assert = require('node:assert/strict');
const BundleDiscountEngine = require('../lib/bundleDiscountEngine');

test('Bundle Discount Tests', async (t) => {
  await t.test('should apply bundle package discount when all items present', () => {
    const items = [
      { sku: 'CAMERA-01', price: 500, quantity: 1 },
      { sku: 'LENS-01', price: 300, quantity: 1 }
    ];
    const rules = [
      { bundleName: 'Photographer Starter Kit', requiredSkus: ['CAMERA-01', 'LENS-01'], discountAmount: 80 }
    ];
    const res = BundleDiscountEngine.evaluateBundle(items, rules);
    assert.equal(res.subtotal, 800);
    assert.equal(res.totalBundleDiscount, 80);
    assert.equal(res.finalTotal, 720);
  });
});
