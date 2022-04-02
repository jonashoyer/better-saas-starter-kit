import { StripePrice, StripeProduct } from "@prisma/client";
import { NextPage } from "next";

export type StripeProductWithPricing = StripeProduct & { prices: StripePrice[] };

export type AppNextPage = NextPage & {
  authGuard?: 'public' | 'unauthenticated' | 'authenticated';
}