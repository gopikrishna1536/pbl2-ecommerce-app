/**
 * Tiered Domestic & International Shipping Rate Calculator
 */
class TieredShippingCalculator {
  static calculateShipping(cartSubtotal, totalWeightKg, destinationCountry = 'US') {
    if (cartSubtotal < 0 || totalWeightKg <= 0) {
      throw new Error('Invalid subtotal or package weight');
    }

    // Free standard domestic shipping threshold: $75
    if (destinationCountry === 'US' && cartSubtotal >= 75.0) {
      return {
        carrier: 'USPS_GROUND',
        destinationCountry,
        shippingFee: 0.0,
        isFreeShipping: true
      };
    }

    let baseRate = destinationCountry === 'US' ? 5.99 : 18.50;
    let perKgRate = destinationCountry === 'US' ? 1.50 : 6.00;

    const fee = Number((baseRate + (totalWeightKg * perKgRate)).toFixed(2));
    return {
      carrier: destinationCountry === 'US' ? 'USPS_PRIORITY' : 'DHL_EXPRESS',
      destinationCountry,
      shippingFee: fee,
      isFreeShipping: false
    };
  }
}

module.exports = TieredShippingCalculator;
