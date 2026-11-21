const test = require('node:test');
const assert = require('node:assert/strict');
const LoyaltyRewardPoints = require('../lib/loyaltyRewardPoints');

test('Loyalty Reward Points Tests', async (t) => {
  await t.test('should award 1.5x points for Gold members', () => {
    const pts = LoyaltyRewardPoints.calculatePointsEarned(100, 'GOLD');
    assert.equal(pts, 150);
  });

  await t.test('should convert 200 points to $10 discount', () => {
    const res = LoyaltyRewardPoints.redeemPoints(500, 200);
    assert.equal(res.discountAmount, 10.0);
    assert.equal(res.remainingPoints, 300);
  });
});
