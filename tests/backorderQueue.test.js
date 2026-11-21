const test = require('node:test');
const assert = require('node:assert/strict');
const BackorderQueueManager = require('../lib/backorderQueueManager');

test('Backorder Queue Tests', async (t) => {
  await t.test('should allocate restock stock in FIFO order', () => {
    const queue = [
      { orderId: 'BO-2', requestedQuantity: 20, reservedAt: '2026-11-20T12:00:00Z' },
      { orderId: 'BO-1', requestedQuantity: 15, reservedAt: '2026-11-20T10:00:00Z' }
    ];
    // 25 units restocked: BO-1 gets 15 (10 remaining), BO-2 needs 20 so cannot be fulfilled
    const res = BackorderQueueManager.allocateStock(25, queue);
    assert.equal(res.fulfilledCount, 1);
    assert.equal(res.fulfilledOrders[0].orderId, 'BO-1');
    assert.equal(res.stockSurplus, 10);
  });
});
