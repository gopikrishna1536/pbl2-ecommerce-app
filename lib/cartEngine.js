/**
 * E-Commerce Cart & Order Pricing Calculation Engine.
 */
const TAX_RATE = 0.08; // 8% sales tax

const VALID_PROMOS = {
  'SAVE10': 0.10,
  'WELCOME20': 0.20,
  'SUPER50': 0.50
};

function calculateCartTotals(products, items, promoCode = '') {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array.');
  }

  const productMap = new Map(products.map(p => [p.id, p]));
  let subtotal = 0;
  const lineItems = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found.`);
    }

    if (item.quantity <= 0) {
      throw new Error(`Quantity for ${product.name} must be greater than zero.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    const itemTotal = Number((product.price * item.quantity).toFixed(2));
    subtotal += itemTotal;

    lineItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      itemTotal
    });
  }

  subtotal = Number(subtotal.toFixed(2));

  // Calculate discount
  let discountAmount = 0;
  let discountApplied = null;
  const promoUpper = promoCode ? promoCode.trim().toUpperCase() : '';

  if (promoUpper && VALID_PROMOS[promoUpper]) {
    const discountRate = VALID_PROMOS[promoUpper];
    discountAmount = Number((subtotal * discountRate).toFixed(2));
    discountApplied = { code: promoUpper, percentage: discountRate * 100, amount: discountAmount };
  }

  const discountedSubtotal = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));
  const tax = Number((discountedSubtotal * TAX_RATE).toFixed(2));
  const shipping = subtotal > 150.0 || subtotal === 0 ? 0.0 : 9.99; // Free shipping over $150
  const finalTotal = Number((discountedSubtotal + tax + shipping).toFixed(2));

  return {
    lineItems,
    subtotal,
    discount: discountApplied,
    tax,
    shipping,
    finalTotal
  };
}

module.exports = { calculateCartTotals, TAX_RATE, VALID_PROMOS };
