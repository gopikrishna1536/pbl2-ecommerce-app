const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { AddressValidator } = require('../lib/addressValidator');

describe('Shipping Address & Postal Code Validation Tests', () => {
  test('should validate valid Indian PIN codes and reject corrupted formats', () => {
    assert.equal(AddressValidator.isValidPostalCode('560001', 'IN'), true);
    assert.equal(AddressValidator.isValidPostalCode('110001', 'IN'), true);
    assert.equal(AddressValidator.isValidPostalCode('010001', 'IN'), false); // Cannot start with 0
    assert.equal(AddressValidator.isValidPostalCode('56001', 'IN'), false);  // Only 5 digits
    assert.equal(AddressValidator.isValidPostalCode('5600012', 'IN'), false); // 7 digits
  });

  test('should validate US ZIP and ZIP+4 formats', () => {
    assert.equal(AddressValidator.isValidPostalCode('90210', 'US'), true);
    assert.equal(AddressValidator.isValidPostalCode('94016-1234', 'US'), true);
    assert.equal(AddressValidator.isValidPostalCode('9401', 'US'), false);
  });

  test('should validate and format complete shipping address', () => {
    const validAddress = {
      fullName: 'Gopi Krishna',
      streetAddress: '100 Tech Park Way',
      apartment: 'Suite 404',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560100',
      country: 'IN'
    };

    const res = AddressValidator.validateShippingAddress(validAddress);
    assert.equal(res.isValid, true);
    assert.equal(res.errors.length, 0);
    assert.ok(res.formattedLabel.includes('Gopi Krishna'));
    assert.ok(res.formattedLabel.includes('Bangalore, Karnataka 560100'));
    assert.ok(res.formattedLabel.includes('IN'));
  });

  test('should flag missing address components with clear error messages', () => {
    const invalidAddress = {
      fullName: '',
      streetAddress: 'Way',
      city: '',
      postalCode: 'invalid'
    };

    const res = AddressValidator.validateShippingAddress(invalidAddress);
    assert.equal(res.isValid, false);
    assert.ok(res.errors.some(e => e.includes('Full name')));
    assert.ok(res.errors.some(e => e.includes('Street address')));
    assert.ok(res.errors.some(e => e.includes('City name')));
  });
});
