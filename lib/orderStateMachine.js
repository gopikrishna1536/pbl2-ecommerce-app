/**
 * Order Lifecycle Finite State Machine (FSM)
 * Enforces valid order progression, cancellation rules, refunds, and audit logging.
 */

const ORDER_STATES = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

const VALID_TRANSITIONS = {
  [ORDER_STATES.PENDING_PAYMENT]: [ORDER_STATES.PAYMENT_RECEIVED, ORDER_STATES.CANCELLED],
  [ORDER_STATES.PAYMENT_RECEIVED]: [ORDER_STATES.PROCESSING, ORDER_STATES.CANCELLED, ORDER_STATES.REFUNDED],
  [ORDER_STATES.PROCESSING]: [ORDER_STATES.SHIPPED, ORDER_STATES.CANCELLED, ORDER_STATES.REFUNDED],
  [ORDER_STATES.SHIPPED]: [ORDER_STATES.OUT_FOR_DELIVERY, ORDER_STATES.CANCELLED],
  [ORDER_STATES.OUT_FOR_DELIVERY]: [ORDER_STATES.DELIVERED],
  [ORDER_STATES.DELIVERED]: [ORDER_STATES.REFUNDED],
  [ORDER_STATES.CANCELLED]: [],
  [ORDER_STATES.REFUNDED]: []
};

class OrderStateMachine {
  constructor(orderId, initialState = ORDER_STATES.PENDING_PAYMENT) {
    if (!orderId) throw new Error('orderId is required');
    if (!ORDER_STATES[initialState]) throw new Error(`Invalid initial state: ${initialState}`);

    this.orderId = orderId;
    this.currentState = initialState;
    this.history = [
      {
        from: null,
        to: initialState,
        reason: 'Order initialized',
        timestamp: new Date().toISOString()
      }
    ];
  }

  canTransitionTo(targetState) {
    const allowed = VALID_TRANSITIONS[this.currentState] || [];
    return allowed.includes(targetState);
  }

  transitionTo(targetState, reason = 'State transition', actor = 'system') {
    if (!this.canTransitionTo(targetState)) {
      throw new Error(`Invalid transition from ${this.currentState} to ${targetState}`);
    }

    const previousState = this.currentState;
    this.currentState = targetState;

    const entry = {
      from: previousState,
      to: targetState,
      reason,
      actor,
      timestamp: new Date().toISOString()
    };
    this.history.push(entry);

    return entry;
  }

  isTerminal() {
    const allowed = VALID_TRANSITIONS[this.currentState] || [];
    return allowed.length === 0;
  }

  getState() {
    return this.currentState;
  }

  getAuditTrail() {
    return [...this.history];
  }
}

module.exports = {
  ORDER_STATES,
  OrderStateMachine
};
