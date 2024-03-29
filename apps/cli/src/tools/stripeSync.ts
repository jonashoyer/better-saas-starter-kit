import { createStripe, StripeHandler } from "shared-server";
import { config } from 'dotenv';
import path from 'path';
import { PrismaClient, StripePriceType } from '@prisma/client';

config({
  path: path.join(process.cwd(), '.env'),
});

const stripe = createStripe();
const prisma = new PrismaClient();

(async () => {
  
  const handler = new StripeHandler(stripe, prisma);
  const products = (await handler.fetchProductList()).data;
  const prices = await handler.fetchPriceList();

  const filtedPrices = prices.data.filter(e => products.some(x => x.id == e.product));

  await prisma.stripeProduct.createMany({
    data: products.map(e => ({
      id: e.id,
      active: e.active,
      metadata: e.metadata,
      name: e.name,
      image: e.images?.[0] ?? null,
    })),
    skipDuplicates: true,
  });

  await Promise.all(
    products.map(e => {
      const data = {
        id: e.id,
        active: e.active,
        metadata: e.metadata,
        name: e.name,
        image: e.images?.[0] ?? null,
      };

      return prisma.stripeProduct.upsert({
        where: { id: e.id },
        create: data,
        update: data,
      })
    })
  );

  await Promise.all(
    filtedPrices.map(e => {
      const data = {
        id: e.id,
        stripeProductId: e.product as string,
        active: e.active,
        currency: e.currency,
        type: e.type.toUpperCase() as StripePriceType,
        unitAmount: e.unit_amount,
        interval: e.recurring?.interval,
        intervalCount: e.recurring?.interval_count,
        trialPeriodDays: e.recurring?.trial_period_days,
        metadata: e.metadata,
      };

      return prisma.stripePrice.upsert({
        where: { id: e.id },
        create: data,
        update: data,
      })
    })
  );

  console.log(`Imported ${products.length} products and ${filtedPrices.length} prices`);
  process.exit();
})();