import { createStripe, StripeHandler } from "bs-shared-server-kit";
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

config({
  path: path.join(process.cwd(), '.env'),
});

const stripe = createStripe();

async function main() {
  const handler = new StripeHandler(stripe, prisma);
  const products = await handler.fetchProductList();
  const prices = await handler.fetchPriceList();

  const filtedProducts = products.data.filter(e => !!e.metadata.type);
  const filtedPrices = prices.data.filter(e => filtedProducts.some(x => x.id == e.product));

  await prisma.stripeProduct.createMany({
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

  await prisma.stripePrice.createMany({
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

  console.log(`Imported ${filtedProducts.length} products and ${filtedPrices.length} prices`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })