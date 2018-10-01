export function getSubscriptionInfo(subscription) {
  let info = {
    status: subscription.status,
    start: new Date(subscription.start * 1000),
    billing_cycle_anchor: new Date(subscription.billing_cycle_anchor * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    planId: subscription.plan.id,
    customerId: subscription.customer,
    planInterval: subscription.plan.interval,
    planIntervalCount: subscription.plan.interval_count
  };
  return info;
}
