const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createReview, aggregateRatings, filterAndSortReviews } = require('../lib/reviewEngine');

describe('Product Review & Rating Aggregation Engine Tests', () => {
  test('should validate input and create formatted review object', () => {
    const rev = createReview({
      author: 'Gopi Krishna',
      rating: 5,
      comment: 'Excellent build quality and fast delivery!',
      verified: true
    });

    assert.equal(rev.author, 'Gopi Krishna');
    assert.equal(rev.rating, 5);
    assert.equal(rev.verified, true);
    assert.ok(rev.id.startsWith('rev_'));
    assert.ok(rev.createdAt);
  });

  test('should reject invalid author or out-of-range ratings', () => {
    assert.throws(() => createReview({ author: '', rating: 5 }), /Author name is required/);
    assert.throws(() => createReview({ author: 'Alice', rating: 0 }), /between 1 and 5/);
    assert.throws(() => createReview({ author: 'Alice', rating: 6 }), /between 1 and 5/);
    assert.throws(() => createReview({ author: 'Alice', rating: 3.5 }), /integer between 1 and 5/);
  });

  test('should accurately calculate average rating and star distribution breakdown', () => {
    const reviews = [
      { rating: 5 },
      { rating: 5 },
      { rating: 4 },
      { rating: 3 }
    ];

    const stats = aggregateRatings(reviews);
    assert.equal(stats.totalReviews, 4);
    // (5+5+4+3)/4 = 17/4 = 4.25 -> rounded to 4.3
    assert.equal(stats.averageRating, 4.3);
    // 3 out of 4 >= 4 stars -> 75%
    assert.equal(stats.recommendPercentage, 75);
    // 5-star: 2/4 = 50%
    assert.equal(stats.distribution[5], 50);
    // 4-star: 1/4 = 25%
    assert.equal(stats.distribution[4], 25);
    // 3-star: 1/4 = 25%
    assert.equal(stats.distribution[3], 25);
    assert.equal(stats.distribution[1], 0);
  });

  test('should filter by verified status and sort by helpfulness', () => {
    const reviews = [
      { author: 'User A', rating: 3, verified: false, helpfulVotes: 2, createdAt: '2026-01-01' },
      { author: 'User B', rating: 5, verified: true, helpfulVotes: 42, createdAt: '2026-02-01' },
      { author: 'User C', rating: 4, verified: true, helpfulVotes: 10, createdAt: '2026-03-01' }
    ];

    const verified = filterAndSortReviews(reviews, { verifiedOnly: true, sortBy: 'helpful' });
    assert.equal(verified.length, 2);
    assert.equal(verified[0].author, 'User B'); // 42 votes
    assert.equal(verified[1].author, 'User C'); // 10 votes
  });
});
