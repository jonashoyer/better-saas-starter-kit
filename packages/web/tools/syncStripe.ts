import { createStripe, StripeHandler } from "../../shared-server/lib";
import { config } from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

config({
  path: path.join(process.cwd(), '.env'),
});

const stripe = createStripe();
const prisma = new PrismaClient();

(async () => {
  
  const handler = new StripeHandler(stripe, prisma);
  const products = await handler.fetchProductList();
  const prices = await handler.fetchPriceList();

  const filtedProducts = products.data.filter(e => !!e.metadata.type);
  const filtedPrices = prices.data.filter(e => filtedProducts.some(x => x.id == e.product));

  await prisma.product.createMany({
    data: filtedProducts.map(e => ({
      id: e.id,
      active: e.active,
      metadata: e.metadata,
      name: e.name,
      type: e.metadata.type,
      image: e.images?.[0] ?? null,

    })),
    skipDuplicates: true,
  });

  await prisma.productPrice.createMany({
    data: filtedPrices.map(e => ({
      id: e.id,
      productId: e.product as string,
      active: e.active,
      currency: e.currency,
      type: e.type,
      unitAmount: e.unit_amount,
      interval: e.recurring?.interval,
      intervalCount: e.recurring?.interval_count,
      trialPeriodDays: e.recurring?.trial_period_days,
      metadata: e.metadata,
    })),
    skipDuplicates: true,
  });

  console.log('done');

})();