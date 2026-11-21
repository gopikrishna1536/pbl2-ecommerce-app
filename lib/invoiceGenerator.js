/**
 * Tax-Compliant E-Commerce Invoice & Receipt Generation Engine.
 */

class InvoiceGenerator {
  /**
   * Generates a tax-compliant commercial invoice.
   */
  static generateInvoice(orderData) {
    const {
      orderId,
      customerName,
      customerEmail,
      shippingAddress,
      items = [],
      discountAmount = 0,
      shippingFee = 0,
      taxRate = 0.08, // 8% default sales tax
      issuedDate = new Date()
    } = orderData;

    if (!orderId) throw new Error('orderId is required');
    if (!customerName) throw new Error('customerName is required');
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invoice must include at least one item');
    }

    const dateObj = new Date(issuedDate);
    const dateStr = dateObj.toISOString().slice(0, 7).replace('-', '');
    const invoiceNumber = `INV-${dateStr}-${orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-5).toUpperCase()}`;

    let subtotal = 0;
    const lineItems = items.map(item => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.price) || 0);
      const lineTotal = Math.round(qty * price * 100) / 100;
      subtotal += lineTotal;

      return {
        sku: item.sku || 'N/A',
        name: item.name || 'Product Item',
        unitPrice: price,
        quantity: qty,
        lineTotal
      };
    });

    const netSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(netSubtotal * taxRate * 100) / 100;
    const grandTotal = Math.round((netSubtotal + shippingFee + taxAmount) * 100) / 100;

    return {
      invoiceNumber,
      orderId,
      issuedAt: dateObj.toISOString(),
      customer: {
        name: customerName,
        email: customerEmail || 'N/A',
        address: shippingAddress || 'N/A'
      },
      lineItems,
      financialSummary: {
        subtotal: Math.round(subtotal * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        netTaxableSubtotal: Math.round(netSubtotal * 100) / 100,
        taxRate,
        taxAmount,
        shippingFee: Math.round(shippingFee * 100) / 100,
        grandTotal
      }
    };
  }

  /**
   * Generates a printable plain text receipt.
   */
  static renderPlainTextReceipt(invoice) {
    const lines = [
      '====================================================',
      `             COMMERCIAL SALES RECEIPT               `,
      '====================================================',
      `Invoice #: ${invoice.invoiceNumber}`,
      `Order Ref: ${invoice.orderId}`,
      `Date:      ${invoice.issuedAt.slice(0, 10)}`,
      `Customer:  ${invoice.customer.name}`,
      '----------------------------------------------------',
      'ITEM                         QTY    UNIT     TOTAL  ',
      '----------------------------------------------------'
    ];

    invoice.lineItems.forEach(item => {
      const name = item.name.padEnd(26).slice(0, 26);
      const qty = String(item.quantity).padStart(4);
      const unit = `$${item.unitPrice.toFixed(2)}`.padStart(8);
      const total = `$${item.lineTotal.toFixed(2)}`.padStart(9);
      lines.push(`${name} ${qty} ${unit} ${total}`);
    });

    lines.push('----------------------------------------------------');
    lines.push(`Subtotal:                  $${invoice.financialSummary.subtotal.toFixed(2).padStart(8)}`);
    if (invoice.financialSummary.discountAmount > 0) {
      lines.push(`Discount:                 -$${invoice.financialSummary.discountAmount.toFixed(2).padStart(8)}`);
    }
    lines.push(`Estimated Tax (${Math.round(invoice.financialSummary.taxRate * 100)}%):       $${invoice.financialSummary.taxAmount.toFixed(2).padStart(8)}`);
    lines.push(`Shipping:                  $${invoice.financialSummary.shippingFee.toFixed(2).padStart(8)}`);
    lines.push('====================================================');
    lines.push(`GRAND TOTAL:               $${invoice.financialSummary.grandTotal.toFixed(2).padStart(8)}`);
    lines.push('====================================================');

    return lines.join('\n');
  }
}

module.exports = { InvoiceGenerator };
