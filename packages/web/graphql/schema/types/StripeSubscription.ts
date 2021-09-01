import { arg, enumType, inputObjectType, intArg, mutationField, objectType, queryField, stringArg } from 'nexus';
import Stripe from 'stripe';
import { secondsToDate } from '../../../../shared-server/lib';
import { requireProjectAccess } from './permissions';

export const BillingInfomation = objectType({
  name: 'BillingInfomation',
  definition(t) {
    t.string('currentPrice', { required: true });
    t.int('currentQuantity', { required: true });
    t.field('latestInvoice', { type: 'Invoice', required: true, });
    t.field('upcomingInvoice', { type: 'Invoice', required: true, });
  }
})

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

export const Invoice = objectType({
  name: 'Invoice',
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

const formatStripeInvoice = (s: Stripe.Invoice) => ({
  id: 'unset',
  created: secondsToDate(s.created),
  dueDate: s.due_date && secondsToDate(s.due_date),
  status: s.status.toUpperCase() as any,
  amountDue: s.amount_due,
  amountPaid: s.amount_paid,
  amountRemaining: s.amount_remaining,
  billingReason: s.billing_reason as any,
  invoicePdf: s.invoice_pdf,
  periodStart: secondsToDate(s.period_start),
  periodEnd: secondsToDate(s.period_end),
  receiptNumber: s.receipt_number,
  subtotal: s.subtotal,
  tax: s.tax,
  total: s.total,
  projectId: 'unset',
})

export const getBillingInfomation = queryField('getBillingInfomation', {
  type: BillingInfomation,
  args: {
    subscriptionId: stringArg({ required: true }),
  },
  async resolve(root, { subscriptionId }, ctx) {

    const subscription = await ctx.stripe.subscriptions.retrieve(subscriptionId, {
      expand: [
        'latest_invoice',
        'items.data.price.product',
      ],
    });

    const upcoming_invoice = await ctx.stripe.invoices.retrieveUpcoming({
      subscription: subscriptionId,
    });

    const item = subscription.items.data[0];

    console.log(subscription.latest_invoice, upcoming_invoice);

    return {
      currentPrice: item.price.id,
      currentQuantity: item.quantity,
      latestInvoice: formatStripeInvoice(subscription.latest_invoice as Stripe.Invoice),
      upcomingInvoice: formatStripeInvoice(upcoming_invoice),
    };
  }
})

export const StripeSubscriptionStatus = enumType({
  name: 'StripeSubscriptionStatus',
  members: [
    'INCOMPLETE',
    'INCOMPLETE_EXPIRED',
    'TRIALING',
    'ACTIVE',
    'PAST_DUE',
    'CANCELED',
    'UNPAID',
  ]
})

export const StripeSubscription = objectType({
  name: 'StripeSubscription',
  definition(t) {
    t.model.id();
    t.model.metadata();
    t.model.status();
    t.model.priceId();
    t.model.quantity();
    t.model.cancelAtPeriodEnd();
    t.model.cancelAt();
    t.model.canceledAt();
    t.model.currentPeriodStart();
    t.model.currentPeriodEnd();
    t.model.created();
    t.model.endedAt();
  }
})

export const UpsertSubscriptionInput = inputObjectType({
  name: 'UpsertSubscriptionInput',
  definition(t) {
    t.string('projectId', { required: true });
    t.string('priceId', { required: true });
  }
})

export const upsertSubscription = mutationField('upsertSubscription', {
  type: StripeSubscription,
  args: {
    input: arg({ type: UpsertSubscriptionInput, required: true }),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.input.projectId }),
  async resolve(root, { input }, ctx) {

    const { projectId, priceId } = input;

    const project = await ctx.prisma.project.findUnique({
      where: { id: projectId },
      select: { stripeCustomerId: true, stripeSubscriptionId: true },
    });

    const userProjectCount = await ctx.prisma.userProject.count({
      where: { projectId },
    });
    const quantity = userProjectCount;

    if (project.stripeSubscriptionId) {
      return ctx.getStripeHandler().updateSubscription(project.stripeSubscriptionId, priceId, quantity);
    }

    return ctx.getStripeHandler().createSubscription(project.stripeCustomerId, priceId, quantity);
  }
})