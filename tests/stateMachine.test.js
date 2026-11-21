const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { OrderStateMachine, ORDER_STATES } = require('../lib/orderStateMachine');

describe('Order Lifecycle State Machine Tests', () => {
  test('should initialize in PENDING_PAYMENT with initial history record', () => {
    const fsm = new OrderStateMachine('ord-101');
    assert.equal(fsm.getState(), ORDER_STATES.PENDING_PAYMENT);
    assert.equal(fsm.isTerminal(), false);

    const history = fsm.getAuditTrail();
    assert.equal(history.length, 1);
    assert.equal(history[0].to, ORDER_STATES.PENDING_PAYMENT);
  });

  test('should follow standard happy path: PAYMENT -> PROCESSING -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED', () => {
    const fsm = new OrderStateMachine('ord-102');

    fsm.transitionTo(ORDER_STATES.PAYMENT_RECEIVED, 'Stripe webhook payment confirmed', 'payment_gateway');
    assert.equal(fsm.getState(), ORDER_STATES.PAYMENT_RECEIVED);

    fsm.transitionTo(ORDER_STATES.PROCESSING, 'Order sent to fulfillment warehouse', 'warehouse_worker');
    assert.equal(fsm.getState(), ORDER_STATES.PROCESSING);

    fsm.transitionTo(ORDER_STATES.SHIPPED, 'FedEx tracking #9876543210', 'courier_service');
    assert.equal(fsm.getState(), ORDER_STATES.SHIPPED);

    fsm.transitionTo(ORDER_STATES.OUT_FOR_DELIVERY, 'Courier van dispatched', 'courier_service');
    assert.equal(fsm.getState(), ORDER_STATES.OUT_FOR_DELIVERY);

    fsm.transitionTo(ORDER_STATES.DELIVERED, 'Signed by recipient', 'courier_service');
    assert.equal(fsm.getState(), ORDER_STATES.DELIVERED);

    const audit = fsm.getAuditTrail();
    assert.equal(audit.length, 6);
  });

  test('should reject invalid transitions and throw descriptive errors', () => {
    const fsm = new OrderStateMachine('ord-103');

    // Cannot jump directly from PENDING_PAYMENT to DELIVERED
    assert.throws(
      () => fsm.transitionTo(ORDER_STATES.DELIVERED),
      /Invalid transition from PENDING_PAYMENT to DELIVERED/
    );

    // Cannot jump directly from PENDING_PAYMENT to SHIPPED
    assert.throws(
      () => fsm.transitionTo(ORDER_STATES.SHIPPED),
      /Invalid transition from PENDING_PAYMENT to SHIPPED/
    );
  });

  test('should handle cancellation and enforce terminal state immutability', () => {
    const fsm = new OrderStateMachine('ord-104');

    fsm.transitionTo(ORDER_STATES.CANCELLED, 'Customer changed their mind', 'customer');
    assert.equal(fsm.getState(), ORDER_STATES.CANCELLED);
    assert.equal(fsm.isTerminal(), true);

    // Cannot transition anywhere once cancelled
    assert.throws(
      () => fsm.transitionTo(ORDER_STATES.PAYMENT_RECEIVED),
      /Invalid transition from CANCELLED to PAYMENT_RECEIVED/
    );
  });
});
