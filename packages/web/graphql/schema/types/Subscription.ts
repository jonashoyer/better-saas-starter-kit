import { enumType, intArg, mutationField, objectType, queryField, stringArg } from 'nexus';
import Stripe from 'stripe';
import { PaymentMethodImportance } from 'types/gql';
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
    t.model.stripeInvoiceId();
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
  stripeInvoiceId: s.id,
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
  projectId: '1',
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

export const SubscriptionStatus = enumType({
  name: 'SubscriptionStatus',
  members: [
    'ACTIVE',
    'CANCELED',
    'INCOMPLETE',
    'INCOMPLETE_EXPIRED',
    'PAST_DUE',
    'TRIALING',
    'UNPAID',
  ]
})

export const Subscription = objectType({
  name: 'Subscription',
  definition(t) {
    t.string('stripeSubscriptionId', { required: true });
    t.field('status', { type: SubscriptionStatus, required: true });
    t.Date('trialEnd');
  }
})

const formatStripeSubscription = (s: Stripe.Subscription) => ({
  stripeSubscriptionId: s.id,
  status: s.status.toUpperCase() as any,
  trialEnd: s.trial_end && secondsToDate(s.trial_end),
})

export const createSubscription = mutationField('createSubscription', {
  type: Subscription,
  args: {
    projectId: stringArg({ required: true }),
    priceId: stringArg({ required: true }),
    quantity: intArg({ required: true }),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.projectId }),
  async resolve(root, { projectId, priceId, quantity }, ctx) {

    const project = await ctx.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        paymentMethods: true,
      }
    })

    const paymentMethod = project.paymentMethods.reduce((r, e) => {
      if (r.importance == PaymentMethodImportance.Primary) return r;
      if (e.importance == PaymentMethodImportance.Primary) return e;
      if (e.importance == PaymentMethodImportance.Backup) return e;
      return r;
    }, null)

    await ctx.stripe.paymentMethods.attach(paymentMethod.stripePaymentMethodId, {
      customer: project.stripeCustomerId,
    });

    await ctx.stripe.customers.update(
      project.stripeCustomerId,
      {
        invoice_settings: {
          default_payment_method: paymentMethod.stripePaymentMethodId,
        },
      }
    );

    // Create the subscription
    const subscription = await ctx.stripe.subscriptions.create({
      customer: project.stripeCustomerId,
      items: [
        { price: priceId, quantity: quantity },
      ],
      expand: ['latest_invoice.payment_intent', 'plan.product'],
    });

    return formatStripeSubscription(subscription);
  }
})

export const updateSubscription = mutationField('updateSubscription', {
  type: Subscription,
  args: {
    projectId: stringArg({ required: true }),
    priceId: stringArg(),
    quantity: intArg(),
  },
  authorize: requireProjectAccess({ role: 'ADMIN', projectIdFn: (_, args) => args.projectId }),
  async resolve(root, { projectId, priceId, quantity }, ctx) {

    const project = await ctx.prisma.project.findUnique({
      where: { id: projectId },
    })

    const subscription = await ctx.stripe.subscriptions.retrieve(project.stripeSubscriptionId);

    const currentPrice = subscription.items.data[0].price.id;

    let updatedSubscription: any;
    if (currentPrice == priceId) {
      updatedSubscription = await ctx.stripe.subscriptions.update(project.stripeSubscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            quantity: quantity,
          },
        ],
      });
    } else {
      updatedSubscription = await ctx.stripe.subscriptions.update(project.stripeSubscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            deleted: true,
          },
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        expand: ['plan.product'],
      });
    }

    const invoice = await ctx.stripe.invoices.create({
      customer: project.stripeCustomerId,
      subscription: subscription.id,
      description:
        'Change to ' +
        quantity +
        ' seat(s) on the ' +
        updatedSubscription.plan.product.name +
        ' plan',
    });

    await ctx.stripe.invoices.pay(invoice.id);
    return formatStripeSubscription(updatedSubscription);
  }
})