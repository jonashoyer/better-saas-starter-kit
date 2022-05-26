import { NextPage } from "next";
import { StripePrice, StripeProduct } from "./gql";

export type StripeProductWithPricing = StripeProduct & { prices: StripePrice[] };

export type AppNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  authGuard?: 'public' | 'unauthenticated' | 'authenticated';
}