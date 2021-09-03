import type * as Prisma from "@prisma/client"
import { randomBytes } from "crypto"
import type { Profile } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import jwt from 'jsonwebtoken';
import { createStripe, StripeHandler } from 'bs-shared-server-kit';
import { NextApiRequest } from "next";
import cuid from 'cuid';
import argon2 from 'argon2';
import { DEFAULT_SUBSCRIPTION_PRICE_ID } from "config";
import { isJSONValueObject } from "utils";

const GENERATE_ACCESS_TOKEN = true;

export const PrismaAdapter: Adapter<
  Prisma.PrismaClient,
  never,
  Prisma.User,
  Profile & { emailVerified?: Date },
  Prisma.Session
> = (prisma) => {
  return {
    async getAdapter({ session, secret, ...appOptions }) {
      const sessionMaxAge = session.maxAge * 1000 // default is 30 days
      const sessionUpdateAge = session.updateAge * 1000 // default is 1 day

      const accessTokenExpiresIn = '20m';


      const generateJWT = (userId: string) => {
        return jwt.sign({ userId: userId }, secret, { expiresIn: accessTokenExpiresIn });
      }

      const withAccessToken = (session: any) => {
        if (!GENERATE_ACCESS_TOKEN) return session;
        return {
          ...session,
          accessToken: generateJWT(session.userId),
        }
      }

      const createUserWithProject = async (profile: Profile & { emailVerified?: Date; password?: string; }) => {
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
              subscriptionPlan: isJSONValueObject(stripeSubscription.metadata) ? stripeSubscription.metadata.type as any : undefined,
              users: {
                create: {
                  role: 'ADMIN',
                  user: {
                    create: {
                      name,
                      email: profile.email,
                      image: profile.image,
                      emailVerified: profile.emailVerified?.toISOString() ?? null,
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
          })

          return {
            project,
            user: project.users[0].user,
          }
        } catch (err) {
          console.error(err);
          await stripe.stripe.subscriptions.del(stripeCustomer.id);
          await stripe.deleteCustomer(stripeCustomer.id);
          throw new err;
        }
      }

      return {
        displayName: "PRISMA",
        async createUser(profile) {
          const { user } = await createUserWithProject(profile);
          return user;
        },

        //NOTE: Credentials login method is unspported
        async credentialsAuthorize({ email, password }: { email: string, password: string }, req: NextApiRequest) {
          const user: any = await prisma.user.findUnique({ where: { email } });
          if (!user) throw new Error('User not found!')
          if (!user.password) throw new Error('User not found!');
          const match = await argon2.verify(user.password, password);
          if (!match) throw new Error('User not found!');
          return user;
        },

        //NOTE: Credentials login method is unspported
        async createCredentialsUser({ email, password }: { email: string, password: string }) {
          const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
          if (existingUser) throw new Error('User already signed up!');
          if (!email) throw new Error('Missing email!');
          if (!password) throw new Error('Missing password!');
          const { user } = await createUserWithProject({ email, password });
          return user;
        },

        getUser(id) {
          // TODO: Caching layer?
          return prisma.user.findUnique({
            where: { id },
          })
        },

        getUserByEmail(email) {
          if (!email) return Promise.resolve(null);
          return prisma.user.findUnique({ where: { email } });
        },

        async getUserByProviderAccountId(providerId, providerAccountId) {
          const account = await prisma.account.findUnique({
            where: {
              providerId_providerAccountId: { providerId, providerAccountId: String(providerAccountId) },
            },
            select: { user: true },
          })
          return account?.user ?? null
        },

        updateUser(user) {
          return prisma.user.update({
            where: { id: user.id },
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: user.emailVerified?.toISOString() ?? null,
            },
          })
        },

        async deleteUser(userId) {
          await prisma.user.delete({
            where: { id: userId },
          })
        },

        async linkAccount(
          userId,
          providerId,
          providerType,
          providerAccountId,
          refreshToken,
          accessToken,
          accessTokenExpires
        ) {
          await prisma.account.create({
            data: {
              userId,
              providerId,
              providerType,
              providerAccountId: String(providerAccountId),
              refreshToken,
              accessToken,
              accessTokenExpires,
            },
          })
        },

        async unlinkAccount(_, providerId, providerAccountId) {
          await prisma.account.delete({
            where: {
              providerId_providerAccountId: { providerId, providerAccountId: String(providerAccountId) },
            },
          })
        },

        async createSession(user, ...rest) {
          const session = await prisma.session.create({
            data: {
              userId: user.id,
              expires: new Date(Date.now() + sessionMaxAge),
              sessionToken: randomBytes(32).toString("hex"),
            },
          })
          
          return withAccessToken(session);
        },

        async getSession(sessionToken) {
          // FIXME: Use shared auth.ts
          const session = await prisma.session.findUnique({
            where: { sessionToken },
          })
          
          if (!session) return null;

          if (session && session.expires < new Date()) {
            await prisma.session.delete({ where: { sessionToken } })
            return null
          }

          return withAccessToken(session);
        },

        async updateSession(session, force) {
          if (
            !force &&
            Number(session.expires) - sessionMaxAge + sessionUpdateAge >
              Date.now()
          ) {
            return null
          }
          const _session = await prisma.session.update({
            where: { id: session.id },
            data: {
              expires: new Date(Date.now() + sessionMaxAge),
            },
          })

          return withAccessToken(_session);
        },

        async deleteSession(sessionToken) {
          await prisma.session.delete({ where: { sessionToken } })
        },

        async createVerificationRequest(identifier, url, token, _, provider) {
          await prisma.verificationRequest.create({
            data: {
              identifier,
              token,
              expires: new Date(Date.now() + provider.maxAge * 1000),
            },
          })
          await provider.sendVerificationRequest({
            identifier,
            url,
            token,
            baseUrl: appOptions.baseUrl,
            provider,
          })
        },

        async getVerificationRequest(identifier, token) {
          const verificationRequest =
            await prisma.verificationRequest.findUnique({
              where: { identifier_token: { identifier, token } },
            })
          if (verificationRequest && verificationRequest.expires < new Date()) {
            await prisma.verificationRequest.delete({
              where: { identifier_token: { identifier, token } },
            })
            return null
          }
          return verificationRequest
        },

        async deleteVerificationRequest(identifier, token) {
          await prisma.verificationRequest.delete({
            where: {
              identifier_token: { identifier, token },
            },
          })
        },
      }
    },
  }
}