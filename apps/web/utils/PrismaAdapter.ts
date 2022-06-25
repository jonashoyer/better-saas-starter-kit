import type * as Prisma from "@prisma/client"
import type { Adapter } from "next-auth/adapters"
import { isJWT } from "shared";
import { authorizeWeb3Token, userService, verifyNextAuthJWT } from 'shared-server';
import { isW3T } from "web3token";

const GENERATE_ACCESS_TOKEN = true;


// const SESSION_MAX_AGE = ms('30d');
// const SESSION_UPDATE_AGE = ms('1d');



export const PrismaAdapter = (prisma: Prisma.PrismaClient): Adapter => {
  return {
    
    async createUser(profile) {
      const { user } = await userService.createUserWithProject(prisma, profile);
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
      return userService.getUser(prisma, id);
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
      return userService.withAccessToken(GENERATE_ACCESS_TOKEN, session);
    },

    async getSessionAndUser(sessionToken) {
      if (isJWT(sessionToken)) {
        const tok = verifyNextAuthJWT(sessionToken);
        const user = await prisma.user.findUnique({ where: { id: tok.sub! } });
        
        const session = {
          id: 'jwt',
          sessionToken,
          userId: tok.sub!,
          expires: new Date(tok.exp! * 1000),
          user: { id: tok.sub! },
        }

        return {
          user,
          session: userService.withAccessToken(GENERATE_ACCESS_TOKEN, session),
        }
      }

      if (isW3T(sessionToken)) {
        const { user, decoded } = await authorizeWeb3Token(prisma, sessionToken);

        const session = {
          id: 'w3t',
          sessionToken,
          userId: user.id,
          expires: new Date(decoded.payload.expiresAt),
          user: { id: user.id },
        }

        return {
          user,
          session: userService.withAccessToken(GENERATE_ACCESS_TOKEN, session),
        }
      }
      
      const sessionWithUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!sessionWithUser) return null;
      const { user, ...session } = sessionWithUser;
      
      if (session && session.expires < new Date()) {
        await prisma.session.delete({ where: { sessionToken } })
        return null
      }

      return { user, session: userService.withAccessToken(GENERATE_ACCESS_TOKEN, session) };
    },

    async updateSession(data) {
      if (isJWT(data.sessionToken) || isW3T(data.sessionToken)) return data as any;
      const session = await prisma.session.update({ where: { sessionToken: data.sessionToken }, data })
      return userService.withAccessToken(GENERATE_ACCESS_TOKEN, session);
    },

    async deleteSession(sessionToken) {
      if (isJWT(sessionToken) || isW3T(sessionToken)) return;
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