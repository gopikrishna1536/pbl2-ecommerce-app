/**
 * High-Concurrency Flash Sale Inventory Quota Guard
 */
class FlashSaleCountdownGuard {
  static checkPurchaseEligibility(userPastPurchasesCount, requestedQty, maxPerUserLimit = 2, totalQuotaRemaining = 100) {
    if (requestedQty <= 0) return { allowed: false, reason: 'Invalid quantity' };

    if (userPastPurchasesCount + requestedQty > maxPerUserLimit) {
      return {
        allowed: false,
        reason: `Exceeds maximum promotional limit of ${maxPerUserLimit} units per customer`
      };
    }

    if (requestedQty > totalQuotaRemaining) {
      return {
        allowed: false,
        reason: 'Flash sale quota exhausted'
      };
    }

    return {
      allowed: true,
      remainingUserQuota: maxPerUserLimit - (userPastPurchasesCount + requestedQty)
    };
  }
}

module.exports = FlashSaleCountdownGuard;
