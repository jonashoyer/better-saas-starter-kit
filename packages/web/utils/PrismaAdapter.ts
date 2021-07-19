import type * as Prisma from "@prisma/client"
import { randomBytes } from "crypto"
import type { Profile } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import jwt from 'jsonwebtoken';

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

      return {
        displayName: "PRISMA",
        async createUser(profile) {
          const user = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              image: profile.image,
              emailVerified: profile.emailVerified?.toISOString() ?? null,
              projects: {
                create: {
                  role: 'ADMIN',
                  project: {
                    create: {
                      name: `${profile.name}'s Project`,
                    }
                  }
                }
              }
            },
            include: {
              projects: {
                select: { id: true },
              },
            },
          });

          try {
            await prisma.billingAccount.create({
              data: {
                name: 'My Billing Account',
                projects: {
                  connect: {
                    id: user.projects[0].id,
                  }
                },
                user: {
                  connect: { id: user.id }
                }
              }
            });
          } catch {}

          return user;
        },

        getUser(id) {
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

        async createSession(user) {
          const session = await prisma.session.create({
            data: {
              userId: user.id,
              expires: new Date(Date.now() + sessionMaxAge),
              sessionToken: randomBytes(32).toString("hex"),
            },
          })
          
          return {
            ...session,
            accessToken: generateJWT(user.id),
          }
        },

        async getSession(sessionToken) {
          const session = await prisma.session.findUnique({
            where: { sessionToken },
          })
          
          if (!session) return null;

          if (session && session.expires < new Date()) {
            await prisma.session.delete({ where: { sessionToken } })
            return null
          }

          return {
            ...session,
            accessToken: generateJWT(session.userId),
          };
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

          return {
            ..._session,
            accessToken: generateJWT(_session.userId),
          }
        },

        async deleteSession(sessionToken) {
          await prisma.session.delete({ where: { sessionToken } })
        },

        async createVerificationRequest(identifier, url, token, _, provider) {
          await prisma.verificationRequest.create({
            data: {
              identifier,
              token: randomBytes(32).toString("hex"),
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