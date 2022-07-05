import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "../../../utils/PrismaAdapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import argon2 from 'argon2';
import { prisma } from '../../../utils/prisma';
import jwt from 'jsonwebtoken';
import { NEXT_AUTH_SECRET } from "../../../configServer";
import { Constants, s } from 'shared';
import { logger } from "shared-server";

const prismaAdapter = PrismaAdapter(prisma);

export default NextAuth({
  logger,
  cookies: {
    sessionToken: {
      name: Constants.NEXT_AUTH_SESSION_TOKEN_COOKIE,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      }
    },
  },
  pages: {
    signIn: '/login',
    signOut: '',
    error: '/login', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/'
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize({ email, password }, req) {
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        const account = await prisma.account.findUnique({ where: { provider_providerAccountId: { provider: 'credentials', providerAccountId: email.toLowerCase() } }, include: { user: true } })
        if (!account) return null

        const match = await argon2.verify(account.accessToken, password);
        if (!match) return null;
        return { id: account.user.id };
      },
    })
  ],
  debug: false,
  theme: { colorScheme: "light" },
  session: {
    maxAge: s(Constants.NEXT_AUTH_SESSION_MAX_AGE),
  },
  
  adapter: prismaAdapter,
  jwt: {
    async encode ({ secret, token }) {
      return jwt.sign({ sub: token.sub }, secret, { expiresIn: Constants.NEXT_AUTH_SESSION_MAX_AGE, noTimestamp: true });
    },
    async decode ({ secret, token }) {
      return jwt.verify(token as string, secret) as any;
    },
  },
  secret: NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: { id: user.id },
      } as any;
    }
  },
})

export type Session = DefaultSession & {
  accessToken?: string;
  user?: {
    id: string;
  }
}