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
  console.dir(products);
})();