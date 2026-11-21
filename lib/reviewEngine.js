/**
 * Product Review & Rating Aggregation Engine
 * Handles rating calculations, star breakdowns, review filters, and sorting.
 */

/**
 * Validates and formats a customer review.
 */
function createReview(data) {
  const { author, rating, comment, verified = false, helpfulVotes = 0 } = data;

  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    throw new Error('Author name is required');
  }
  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5 || !Number.isInteger(numericRating)) {
    throw new Error('Rating must be an integer between 1 and 5');
  }

  return {
    id: `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    author: author.trim(),
    rating: numericRating,
    comment: (comment || '').trim(),
    verified: Boolean(verified),
    helpfulVotes: Math.max(0, Number(helpfulVotes) || 0),
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
  };
}

/**
 * Computes aggregated statistics across a list of reviews.
 */
function aggregateRatings(reviews = []) {
  if (!reviews || reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      recommendPercentage: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  let recommendCount = 0;

  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[star] = (counts[star] || 0) + 1;
    sum += r.rating;
    if (r.rating >= 4) {
      recommendCount++;
    }
  });

  const total = reviews.length;
  const avg = sum / total;
  const distribution = {};

  for (let star = 1; star <= 5; star++) {
    distribution[star] = Math.round((counts[star] / total) * 100);
  }

  return {
    totalReviews: total,
    averageRating: Math.round(avg * 10) / 10,
    recommendPercentage: Math.round((recommendCount / total) * 100),
    distribution
  };
}

/**
 * Filters and sorts reviews.
 */
function filterAndSortReviews(reviews = [], options = {}) {
  let filtered = [...reviews];

  if (options.minRating) {
    filtered = filtered.filter(r => r.rating >= options.minRating);
  }

  if (options.verifiedOnly) {
    filtered = filtered.filter(r => r.verified === true);
  }

  const sortBy = options.sortBy || 'recent';

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpfulVotes - a.helpfulVotes;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return filtered;
}

module.exports = {
  createReview,
  aggregateRatings,
  filterAndSortReviews
};
