const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { InvoiceGenerator } = require('../lib/invoiceGenerator');

describe('E-Commerce Invoice & Receipt Generator Tests', () => {
  const sampleOrder = {
    orderId: 'ord-987654321',
    customerName: 'Gopi Krishna',
    customerEmail: 'gopikrishna7223@gmail.com',
    shippingAddress: '100 Tech Park, Bangalore',
    items: [
      { sku: 'TEE-01', name: 'Premium Tee', price: 29.99, quantity: 2 },
      { sku: 'CAP-01', name: 'Baseball Cap', price: 15.00, quantity: 1 }
    ],
    discountAmount: 10.00,
    shippingFee: 5.00,
    taxRate: 0.08
  };

  test('should generate structured invoice with line totals and tax computation', () => {
    const invoice = InvoiceGenerator.generateInvoice(sampleOrder);

    assert.ok(invoice.invoiceNumber.startsWith('INV-'));
    assert.equal(invoice.customer.name, 'Gopi Krishna');
    assert.equal(invoice.lineItems.length, 2);

    // Subtotal: (29.99 * 2) + 15.00 = 59.98 + 15.00 = 74.98
    assert.equal(invoice.financialSummary.subtotal, 74.98);
    assert.equal(invoice.financialSummary.discountAmount, 10.00);
    // Net taxable: 74.98 - 10.00 = 64.98
    assert.equal(invoice.financialSummary.netTaxableSubtotal, 64.98);
    // Tax: 64.98 * 0.08 = 5.20
    assert.equal(invoice.financialSummary.taxAmount, 5.20);
    // Grand total: 64.98 + 5.00 shipping + 5.20 tax = 75.18
    assert.equal(invoice.financialSummary.grandTotal, 75.18);
  });

  test('should render formatted plain-text printable receipt', () => {
    const invoice = InvoiceGenerator.generateInvoice(sampleOrder);
    const receipt = InvoiceGenerator.renderPlainTextReceipt(invoice);

    assert.ok(receipt.includes('COMMERCIAL SALES RECEIPT'));
    assert.ok(receipt.includes(invoice.invoiceNumber));
    assert.ok(receipt.includes('Premium Tee'));
    assert.ok(receipt.includes('GRAND TOTAL:'));
  });

  test('should reject orders with missing customer or empty items', () => {
    assert.throws(() => InvoiceGenerator.generateInvoice({ orderId: '123' }), /customerName is required/);
    assert.throws(() => InvoiceGenerator.generateInvoice({ orderId: '123', customerName: 'Alex', items: [] }), /at least one item/);
  });
});
