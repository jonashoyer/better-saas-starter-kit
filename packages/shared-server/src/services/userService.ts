import type * as Prisma from "@prisma/client"
import type { Profile } from "next-auth"
import { StripeHandler } from '../StripeHandler';
import { createStripe } from '../stripe';
import cuid from 'cuid';
import { DEFAULT_SUBSCRIPTION_PRICE_ID } from "../config";

export const createUserWithProject = async (prisma: Prisma.PrismaClient, profile: Profile & { emailVerified?: Date; password?: string; }, account?: Prisma.Prisma.AccountCreateWithoutUserInput) => {
  if (!DEFAULT_SUBSCRIPTION_PRICE_ID) throw new Error('Missing subscription price ID!');

  const projectId = cuid();

  const name = profile.name || profile.email?.split('@')[0] || 'Unnamed';
  const firstName = name.split(' ')[0];

  const stripe = new StripeHandler(createStripe(), prisma);
  const stripeCustomer = await stripe.createCustomer({
    name,
    email: profile.email,
    metadata: {
      projectId,
    },
  });
  const stripeSubscription = await stripe.createSubscription(stripeCustomer.id, DEFAULT_SUBSCRIPTION_PRICE_ID, 1);

  try {

    const project = await prisma.project.create({
      data: {
        id: projectId,
        name: `${firstName}'s Project`,
        stripeCustomerId: stripeCustomer.id,
        users: {
          create: {
            role: 'ADMIN',
            user: {
              create: {
                name,
                email: profile.email,
                image: profile.image,
                emailVerified: profile.emailVerified?.toISOString() ?? null,
                ...(account && { accounts: { create: account } }),
              }
            }
          }
        },
        stripeSubscriptions: {
          create: stripeSubscription,
        }
      },
      include: {
        users: {
          include: {
            user: true,
          }
        }
      }
    });

    return {
      project,
      user: project.users[0].user,
    }
  } catch (err: any) {
    console.error(err);
    await stripe.stripe.subscriptions.del(stripeSubscription.id);
    await stripe.deleteCustomer(stripeCustomer.id);
    throw new err;
  }
}