const test = require('node:test');
const assert = require('node:assert/strict');
const FlashSaleCountdownGuard = require('../lib/flashSaleCountdownGuard');

test('Flash Sale Guard Tests', async (t) => {
  await t.test('should enforce 2-unit limit per customer', () => {
    const res = FlashSaleCountdownGuard.checkPurchaseEligibility(1, 2, 2, 50);
    assert.equal(res.allowed, false);
    assert.ok(res.reason.includes('Exceeds maximum'));
  });
});
