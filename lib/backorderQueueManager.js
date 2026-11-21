/**
 * FIFO Backorder Reservation Queue Manager
 */
class BackorderQueueManager {
  static allocateStock(availableRestockQty, backorderQueue) {
    let remaining = availableRestockQty;
    const fulfilledOrders = [];
    const unfulfilledOrders = [];

    // Queue sorted FIFO by reservation timestamp
    const sorted = [...backorderQueue].sort((a, b) => new Date(a.reservedAt) - new Date(b.reservedAt));

    for (const ord of sorted) {
      if (remaining >= ord.requestedQuantity) {
        fulfilledOrders.push(ord);
        remaining -= ord.requestedQuantity;
      } else {
        unfulfilledOrders.push(ord);
      }
    }

    return {
      restockAllocated: availableRestockQty - remaining,
      stockSurplus: remaining,
      fulfilledCount: fulfilledOrders.length,
      unfulfilledCount: unfulfilledOrders.length,
      fulfilledOrders
    };
  }
}

module.exports = BackorderQueueManager;
