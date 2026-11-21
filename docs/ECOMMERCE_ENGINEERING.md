# E-Commerce Architecture & Checkout Pipeline

Comprehensive transactional workflow documentation for `pbl2-ecommerce-app`.

## Core Engines
1. **Cart & Pricing Engine**: Multi-tier discount stacking, sales tax calculation, and dimensional weight shipping.
2. **Order Lifecycle Finite State Machine**: 8 deterministic order states (`PENDING`, `AUTHORIZED`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`).
3. **Gift Card & Balance Ledger**: Double-entry accounting ledger protecting against double-spend concurrency race conditions.
