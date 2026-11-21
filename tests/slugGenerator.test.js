const test = require('node:test');
const assert = require('node:assert/strict');
const SeoSlugGenerator = require('../lib/seoSlugGenerator');

test('SEO Slug Generator Tests', async (t) => {
  await t.test('should sanitize title and generate clean URL slug', () => {
    const slug = SeoSlugGenerator.generateSlug('Café Gourmet - 100% Arabica Blend!', 'sku123');
    assert.equal(slug, 'cafe-gourmet-100-arabica-blend-sku123');
  });
});
