import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "../../../utils/PrismaAdapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import argon2 from 'argon2';
import { prisma } from '../../../utils/prisma';

const prismaAdapter = PrismaAdapter(prisma);

export default NextAuth({
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
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user || !user.password) return null;
          const verified = await argon2.verify(user.password, credentials.password);
          if (!verified) return null;
          return user;
        } catch (err) {
          console.error(err);
          return null;
        }
      }
    }),
  ],
  debug: false,
  theme: { colorScheme: "light" },
  
  adapter: prismaAdapter,
  secret: process.env.SECRET,
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