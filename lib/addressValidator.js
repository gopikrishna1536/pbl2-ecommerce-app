/**
 * International Shipping Address & Postal Code Validation Engine.
 * Supports format validation for India (PIN), US (ZIP/ZIP+4), UK, and international destinations.
 */

const POSTAL_REGEX = {
  IN: /^[1-9][0-9]{5}$/, // Indian 6-digit PIN code
  US: /^[0-9]{5}(?:-[0-9]{4})?$/, // US 5-digit or 9-digit ZIP+4
  UK: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, // UK Postcode
  GENERIC: /^[A-Z0-9\-\s]{3,10}$/i
};

class AddressValidator {
  /**
   * Validates postal code format for a specified country code (ISO-2).
   */
  static isValidPostalCode(postalCode, countryCode = 'IN') {
    if (!postalCode || typeof postalCode !== 'string') return false;
    const cleaned = postalCode.trim();
    const regex = POSTAL_REGEX[countryCode.toUpperCase()] || POSTAL_REGEX.GENERIC;
    return regex.test(cleaned);
  }

  /**
   * Validates complete shipping address payload.
   */
  static validateShippingAddress(address) {
    if (!address || typeof address !== 'object') {
      return { isValid: false, errors: ['Address object is required'] };
    }

    const errors = [];
    const {
      fullName,
      streetAddress,
      city,
      state,
      postalCode,
      country = 'IN',
      phoneNumber
    } = address;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
    if (!streetAddress || typeof streetAddress !== 'string' || streetAddress.trim().length < 5) {
      errors.push('Street address must be at least 5 characters');
    }
    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      errors.push('City name is required');
    }
    if (!state || typeof state !== 'string' || state.trim().length < 2) {
      errors.push('State or province name is required');
    }
    if (!AddressValidator.isValidPostalCode(postalCode, country)) {
      errors.push(`Invalid postal/ZIP code format for country ${country.toUpperCase()}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      formattedLabel: errors.length === 0 ? AddressValidator.formatShippingLabel(address) : null
    };
  }

  /**
   * Formats standardized multi-line courier shipping label.
   */
  static formatShippingLabel(address) {
    const {
      fullName,
      streetAddress,
      apartment,
      city,
      state,
      postalCode,
      country = 'IN'
    } = address;

    const line2 = apartment ? `${apartment}\n` : '';
    return `${fullName.trim()}\n${streetAddress.trim()}\n${line2}${city.trim()}, ${state.trim()} ${postalCode.trim()}\n${country.toUpperCase()}`;
  }
}

module.exports = { AddressValidator, POSTAL_REGEX };
