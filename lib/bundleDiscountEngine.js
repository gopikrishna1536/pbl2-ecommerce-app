/**
 * Bundle Discount Engine
 */
class BundleDiscountEngine {
  static evaluateBundle(items, bundleRules = []) {
    const skusInCart = new Set(items.map(i => i.sku));
    let totalBundleDiscount = 0;
    const appliedBundles = [];

    for (const rule of bundleRules) {
      const hasAllRequired = rule.requiredSkus.every(s => skusInCart.has(s));
      if (hasAllRequired) {
        totalBundleDiscount += rule.discountAmount;
        appliedBundles.push(rule.bundleName);
      }
    }

    const subtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const finalTotal = Math.max(0, Number((subtotal - totalBundleDiscount).toFixed(2)));

    return {
      subtotal,
      totalBundleDiscount: Number(totalBundleDiscount.toFixed(2)),
      finalTotal,
      appliedBundles
    };
  }
}

module.exports = BundleDiscountEngine;
