/**
 * Digital Gift Card Transaction Ledger
 */
class GiftCardLedger {
  static applyGiftCard(orderTotal, cardBalance) {
    if (orderTotal <= 0) throw new Error('Order total must be positive');
    if (cardBalance <= 0) {
      return {
        appliedAmount: 0.0,
        remainingOrderTotal: orderTotal,
        remainingCardBalance: 0.0
      };
    }

    const applied = Math.min(orderTotal, cardBalance);
    const remainingTotal = Number((orderTotal - applied).toFixed(2));
    const remainingCard = Number((cardBalance - applied).toFixed(2));

    return {
      appliedAmount: Number(applied.toFixed(2)),
      remainingOrderTotal: remainingTotal,
      remainingCardBalance: remainingCard
    };
  }
}

module.exports = GiftCardLedger;
