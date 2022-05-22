import { enumType, objectType } from 'nexus';


export const InvoiceStatus = enumType({
  name: 'InvoiceStatus',
  members: [
    'DELETED',
    'DRAFT',
    'OPEN',
    'PAID',
    'UNCOLLECTIBLE',
    'VOID',
  ]
})

export const InvoiceBillingReason = enumType({
  name: 'InvoiceBillingReason',
  members: [
    'AUTOMATIC_PENDING_INVOICE_ITEM_INVOICE',
    'MANUAL',
    'QUOTE_ACCEPT',
    'SUBSCRIPTION',
    'SUBSCRIPTION_CREATE',
    'SUBSCRIPTION_CYCLE',
    'SUBSCRIPTION_THRESHOLD',
    'SUBSCRIPTION_UPDATE',
    'UPCOMING',
  ]
})

export const StripeInvoice = objectType({
  name: 'StripeInvoice',
  definition(t) {
    t.model.id();
    t.model.created();
    t.model.dueDate();
    t.model.status();
    t.model.amountDue();
    t.model.amountPaid();
    t.model.amountRemaining();
    t.model.billingReason();
    t.model.invoicePdf();
    t.model.periodStart();
    t.model.periodEnd();
    t.model.receiptNumber();
    t.model.subtotal();
    t.model.tax();
    t.model.total();
  }
})

// const formatStripeInvoice = (s: Stripe.Invoice) => ({
//   id: 'unset',
//   created: secondsToDate(s.created),
//   dueDate: s.due_date && secondsToDate(s.due_date),
//   status: s.status.toUpperCase() as any,
//   amountDue: s.amount_due,
//   amountPaid: s.amount_paid,
//   amountRemaining: s.amount_remaining,
//   billingReason: s.billing_reason as any,
//   invoicePdf: s.invoice_pdf,
//   periodStart: secondsToDate(s.period_start),
//   periodEnd: secondsToDate(s.period_end),
//   receiptNumber: s.receipt_number,
//   subtotal: s.subtotal,
//   tax: s.tax,
//   total: s.total,
//   projectId: 'unset',
// })