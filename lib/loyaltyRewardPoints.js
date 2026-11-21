/**
 * Customer Loyalty Rewards Tier Progression & Points Redemption
 * 100 points = $5.00 reward discount
 */
class LoyaltyRewardPoints {
  static calculatePointsEarned(spentAmount, tier = 'BRONZE') {
    let multiplier = 1.0;
    if (tier === 'PLATINUM') multiplier = 2.0;
    else if (tier === 'GOLD') multiplier = 1.5;
    else if (tier === 'SILVER') multiplier = 1.2;

    return Math.floor(spentAmount * multiplier);
  }

  static redeemPoints(pointsAvailable, pointsToRedeem) {
    if (pointsToRedeem > pointsAvailable) {
      throw new Error('Cannot redeem more points than available');
    }

    // 100 pts = $5 ($0.05 per point)
    const discountAmount = Number((pointsToRedeem * 0.05).toFixed(2));
    const remainingPoints = pointsAvailable - pointsToRedeem;

    return {
      pointsRedeemed: pointsToRedeem,
      discountAmount,
      remainingPoints
    };
  }
}

module.exports = LoyaltyRewardPoints;
