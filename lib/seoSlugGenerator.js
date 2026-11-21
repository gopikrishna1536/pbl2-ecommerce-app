/**
 * Canonical SEO Slug Generator
 */
class SeoSlugGenerator {
  static generateSlug(title, uniqueSuffix = null) {
    if (!title) return '';

    let slug = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');

    if (uniqueSuffix) {
      slug = `${slug}-${uniqueSuffix}`;
    }

    return slug;
  }
}

module.exports = SeoSlugGenerator;
