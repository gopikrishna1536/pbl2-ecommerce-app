const test = require('node:test');
const assert = require('node:assert/strict');
const GiftCardLedger = require('../lib/giftCardLedger');

test('Gift Card Ledger Tests', async (t) => {
  await t.test('should deplete partial gift card balance', () => {
    // Order $40 on $100 card -> $40 applied, $0 remaining total, $60 card balance
    const res = GiftCardLedger.applyGiftCard(40.0, 100.0);
    assert.equal(res.appliedAmount, 40.0);
    assert.equal(res.remainingOrderTotal, 0.0);
    assert.equal(res.remainingCardBalance, 60.0);
  });
});
