const express = require('express');
const cors = require('cors');
const products = require('./data/products.json');
const { calculateCartTotals } = require('./lib/cartEngine');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'E-Commerce Platform API', productsCount: products.length });
});

// List products with optional category & price filters
app.get('/api/products', (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;

  let result = products;

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (minPrice) {
    result = result.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.price <= parseFloat(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  res.json({ products: result, count: result.length });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product });
});

// Calculate cart totals & discount
app.post('/api/cart/calculate', (req, res) => {
  try {
    const { items, promoCode } = req.body;
    const totals = calculateCartTotals(products, items, promoCode);
    res.json({ success: true, totals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Process simulated checkout
app.post('/api/checkout', (req, res) => {
  try {
    const { items, promoCode, customer } = req.body;
    if (!customer || !customer.email || !customer.name) {
      return res.status(400).json({ error: 'Customer name and email are required.' });
    }

    const totals = calculateCartTotals(products, items, promoCode);

    const orderReceipt = {
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: customer.name,
        email: customer.email,
        shippingAddress: customer.address || 'Standard Delivery Address'
      },
      paymentStatus: 'PAID_SIMULATED',
      ...totals
    };

    res.status(201).json({ success: true, order: orderReceipt });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`E-commerce API server running on port ${PORT}`);
  });
}

module.exports = app;
