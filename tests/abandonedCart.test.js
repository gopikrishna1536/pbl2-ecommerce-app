const test = require('node:test');
const assert = require('node:assert/strict');
const AbandonedCartRecovery = require('../lib/abandonedCartRecovery');

test('Abandoned Cart Recovery Tests', async (t) => {
  await t.test('should offer 15% discount code for high-value carts dormant > 24 hours', () => {
    const twoDaysAgo = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
    const res = AbandonedCartRecovery.evaluateCart(twoDaysAgo, 150.0, 24);
    assert.equal(res.isAbandoned, true);
    assert.equal(res.recoveryDiscountPercent, 15);
    assert.ok(res.couponCode.startsWith('RECOVER15-'));
  });
});
