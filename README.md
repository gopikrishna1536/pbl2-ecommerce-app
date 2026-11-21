# Modern E-Commerce Platform & Checkout REST API

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Testing](https://img.shields.io/badge/Tests-Passing-25A162?style=for-the-badge)](tests/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A robust e-commerce product catalog, shopping cart calculation engine, and order checkout API built with Node.js and Express. Features promo code discounts, sales tax computation, stock validation, and simulated payment processing.

---

## ✨ Features

- **Product Catalog Management:** Filter products by category, price ranges, and keyword search.
- **Cart Calculation Engine:** Precise subtotal calculation, tiered free shipping rules (free over $150), and 8% sales tax computation.
- **Promo Code Discounts:** Automated validation of discount codes (`SAVE10` for 10%, `WELCOME20` for 20%).
- **Inventory Safeguards:** Rejects cart submissions exceeding real-time available inventory stock.
- **Simulated Order Checkout:** Generates structured order receipts with timestamped order IDs and customer delivery details.
- **Automated Testing:** Unit tested with Node.js test runner covering tax, discount rates, and edge-case exceptions.

---

## 📂 Project Structure

```
pbl2-ecommerce-app/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI automated testing
├── data/
│   └── products.json              # Product catalog database
├── lib/
│   └── cartEngine.js              # Pricing, discount, and tax calculations
├── tests/
│   └── cart.test.js               # Automated unit tests
├── Dockerfile                     # Container image definition
├── docker-compose.yml             # Local service orchestration
├── package.json                   # Dependencies & npm scripts
├── server.js                      # Express REST API routes
└── README.md                      # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Optional: Docker

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gopikrishna1536/pbl2-ecommerce-app.git
   cd pbl2-ecommerce-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run automated test suite:**
   ```bash
   npm test
   ```

4. **Launch API server:**
   ```bash
   node server.js
   ```

---

## 📄 License
MIT License.
