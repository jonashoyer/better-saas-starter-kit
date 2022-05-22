import type * as Prisma from "@prisma/client"
import { randomBytes } from "crypto"
import type { Profile } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import jwt from 'jsonwebtoken';
import { createStripe, StripeHandler } from 'shared-server';
import cuid from 'cuid';
import { DEFAULT_SUBSCRIPTION_PRICE_ID } from "config";
import { isJSONValueObject } from "utils";

const GENERATE_ACCESS_TOKEN = true;
const ACCESS_TOKEN_EXPIRES_IN = '20m';
const secret = process.env.JWT_SECRET || randomBytes(32).toString('hex');

// const SESSION_MAX_AGE = ms('30d');
// const SESSION_UPDATE_AGE = ms('1d');

const generateJWT = (userId: string) => {
  return jwt.sign({ userId: userId }, secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

const withAccessToken = (withAccessToken: boolean, session: any) => {
  if (!withAccessToken) return session;
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
          create: {
            ...stripeSubscription,
            startDate: new Date(),
          },
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
  } catch (err) {
    console.error(err);
    await stripe.stripe.subscriptions.del(stripeSubscription.id);
    await stripe.deleteCustomer(stripeCustomer.id);
    throw new err;
  }
}

export const PrismaAdapter = (prisma: Prisma.PrismaClient): Adapter => {
  return {
    
    async createUser(profile) {
      const { user } = await createUserWithProject(profile);
      return user;
    },

    //NOTE: Credentials login method is unspported
    // async credentialsAuthorize({ email, password }: { email: string, password: string }, req: NextApiRequest) {
    //   const user: any = await prisma.user.findUnique({ where: { email } });
    //   if (!user) throw new Error('User not found!')
    //   if (!user.password) throw new Error('User not found!');
    //   const match = await argon2.verify(user.password, password);
    //   if (!match) throw new Error('User not found!');
    //   return user;
    // },

    //NOTE: Credentials login method is unspported
    // async createCredentialsUser({ email, password }: { email: string, password: string }) {
    //   const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    //   if (existingUser) throw new Error('User already signed up!');
    //   if (!email) throw new Error('Missing email!');
    //   if (!password) throw new Error('Missing password!');
    //   const { user } = await createUserWithProject({ email, password });
    //   return user;
    // },

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
    async getUserByAccount(provider_providerAccountId) {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId },
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

    linkAccount: ({ access_token, token_type, ...rest }) => prisma.account.create({ data: { ...rest, tokenType: token_type, accessToken: access_token } }) as any,
    unlinkAccount: (provider_providerAccountId) => prisma.account.delete({ where: { provider_providerAccountId } }) as any,

    async createSession(data) {
      const session = await prisma.session.create({ data });
      return withAccessToken(GENERATE_ACCESS_TOKEN, session);
    },

    async getSessionAndUser(sessionToken) {
      
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      
      if (session && session.expires < new Date()) {
        await prisma.session.delete({ where: { sessionToken } })
        return null
      }

      return { user, session: withAccessToken(GENERATE_ACCESS_TOKEN, session) };
    },

    async updateSession(data) {
      const session = await prisma.session.update({ where: { sessionToken: data.sessionToken }, data })
      return withAccessToken(GENERATE_ACCESS_TOKEN, session);
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({ where: { sessionToken } })
    },

    async createVerificationToken(data) {
      // @ts-ignore
        const { id: _, ...verificationToken } = await prisma.verificationToken.create({ data });
      return verificationToken
    },

    async useVerificationToken(identifier_token) {
      try {
        // @ts-ignore
        const { id: _, ...verificationToken } =
          await prisma.verificationToken.delete({ where: { identifier_token } })
        return verificationToken
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.Prisma.PrismaClientKnownRequestError).code === "P2025")
          return null
        throw error
      }
    },
    // async deleteVerificationRequest(identifier, token) {
    //   await prisma.verificationRequest.delete({
    //     where: {
    //       identifier_token: { identifier, token },
    //     },
    //   })
    // },
  }
}