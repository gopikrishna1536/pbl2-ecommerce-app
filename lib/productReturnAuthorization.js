/**
 * Product Return Window & Restocking Fee Calculator
 */
class ProductReturnAuthorization {
  static evaluateReturn(purchaseDateStr, requestDateStr, returnReason, itemPrice, maxReturnDays = 30) {
    const pDate = new Date(purchaseDateStr);
    const rDate = new Date(requestDateStr);
    const daysElapsed = Math.floor((rDate - pDate) / (1000 * 60 * 60 * 24));

    if (daysElapsed > maxReturnDays) {
      return {
        isEligible: false,
        reason: `Exceeded statutory ${maxReturnDays}-day return window (${daysElapsed} days elapsed)`
      };
    }

    // Restocking fee: 0% for defects, 15% for remorse / changed mind
    let restockingFeePercent = returnReason === 'DEFECTIVE' ? 0 : 15;
    const restockingFee = Number((itemPrice * (restockingFeePercent / 100)).toFixed(2));
    const refundAmount = Number((itemPrice - restockingFee).toFixed(2));

    return {
      isEligible: true,
      daysElapsed,
      itemPrice,
      restockingFee,
      refundAmount
    };
  }
}

module.exports = ProductReturnAuthorization;
