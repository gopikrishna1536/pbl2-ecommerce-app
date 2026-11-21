/**
 * Promotional Coupon & Multi-Tier Discount Engine.
 * Supports percentage, fixed dollar, BOGO, cart thresholds, and expiry enforcement.
 */

class CouponEngine {
  /**
   * Validates if a coupon is eligible for a given cart.
   */
  static validateCoupon(coupon, cart, now = new Date()) {
    if (!coupon || !coupon.code) {
      throw new Error('Invalid coupon definition');
    }

    // Expiry check
    if (coupon.expiresAt) {
      const expiry = new Date(coupon.expiresAt);
      if (now.getTime() > expiry.getTime()) {
        return { isValid: false, reason: 'Coupon code has expired' };
      }
    }

    // Usage limit check
    if (coupon.maxUses && (coupon.currentUses || 0) >= coupon.maxUses) {
      return { isValid: false, reason: 'Coupon usage limit has been reached' };
    }

    // Minimum cart subtotal check
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return {
        isValid: false,
        reason: `Cart subtotal must be at least $${coupon.minSubtotal.toFixed(2)} to use this code`
      };
    }

    return { isValid: true, subtotal };
  }

  /**
   * Calculates discount amount and final pricing.
   */
  static applyCoupon(coupon, cart, now = new Date()) {
    const validation = CouponEngine.validateCoupon(coupon, cart, now);
    if (!validation.isValid) {
      return {
        success: false,
        discountAmount: 0,
        subtotal: validation.subtotal || 0,
        finalTotal: validation.subtotal || 0,
        error: validation.reason
      };
    }

    const { subtotal } = validation;
    let discount = 0;

    switch (coupon.type) {
      case 'PERCENTAGE': {
        const pct = Math.min(100, Math.max(0, Number(coupon.value) || 0));
        discount = subtotal * (pct / 100);
        if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
          discount = coupon.maxDiscountCap;
        }
        break;
      }

      case 'FIXED_AMOUNT': {
        discount = Math.min(subtotal, Math.max(0, Number(coupon.value) || 0));
        break;
      }

      case 'BOGO': {
        // Buy X Get Y: for every X units of target product, 1 unit is free
        const targetSku = coupon.targetSku;
        const targetItem = cart.items.find(i => i.sku === targetSku);
        if (targetItem && targetItem.quantity >= 2) {
          const freeUnits = Math.floor(targetItem.quantity / 2);
          discount = freeUnits * targetItem.price;
        }
        break;
      }

      default:
        throw new Error(`Unsupported coupon discount type: ${coupon.type}`);
    }

    const roundedDiscount = Math.round(discount * 100) / 100;
    const finalTotal = Math.max(0, Math.round((subtotal - roundedDiscount) * 100) / 100);

    return {
      success: true,
      couponCode: coupon.code,
      type: coupon.type,
      subtotal,
      discountAmount: roundedDiscount,
      finalTotal,
      savingsPercentage: subtotal > 0 ? Math.round((roundedDiscount / subtotal) * 1000) / 10 : 0
    };
  }
}

module.exports = { CouponEngine };
