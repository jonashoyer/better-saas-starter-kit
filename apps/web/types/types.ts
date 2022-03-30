import { StripePrice, StripeProduct } from "@prisma/client";

export type StripeProductWithPricing = StripeProduct & { prices: StripePrice[] };
