/**
 * Abandoned Cart Recovery Discount Engine
 */
class AbandonedCartRecovery {
  static evaluateCart(cartLastUpdatedIso, cartValue, hoursThreshold = 24) {
    const lastActive = new Date(cartLastUpdatedIso).getTime();
    const now = Date.now();
    const elapsedHours = (now - lastActive) / (1000 * 60 * 60);

    const isAbandoned = elapsedHours >= hoursThreshold;
    let recoveryDiscountPercent = 0;
    let couponCode = null;

    if (isAbandoned) {
      // High-value carts ($100+) receive 15% incentive, otherwise 10%
      recoveryDiscountPercent = cartValue >= 100 ? 15 : 10;
      couponCode = `RECOVER${recoveryDiscountPercent}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    return {
      elapsedHours: Number(elapsedHours.toFixed(1)),
      isAbandoned,
      recoveryDiscountPercent,
      couponCode
    };
  }
}

module.exports = AbandonedCartRecovery;
