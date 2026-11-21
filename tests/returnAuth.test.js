const test = require('node:test');
const assert = require('node:assert/strict');
const ProductReturnAuthorization = require('../lib/productReturnAuthorization');

test('Return Authorization Tests', async (t) => {
  await t.test('should authorize full refund for defective item within window', () => {
    const res = ProductReturnAuthorization.evaluateReturn('2026-11-01', '2026-11-15', 'DEFECTIVE', 100);
    assert.equal(res.isEligible, true);
    assert.equal(res.refundAmount, 100);
  });
});
