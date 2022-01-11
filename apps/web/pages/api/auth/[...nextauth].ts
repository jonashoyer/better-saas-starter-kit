import prisma from "../../../utils/prisma";
import NextAuth, { DefaultSession } from "next-auth"
import Providers from 'next-auth/providers'
import { PrismaAdapter } from "../../../utils/PrismaAdapter"


const prismaAdapter = PrismaAdapter(prisma);

export default NextAuth({
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'user:email read:user'
    }),
  ],
  debug: false,
  theme: "light",
  
  adapter: prismaAdapter,
  secret: process.env.SECRET,
  callbacks: {
    session(session: any, user: any) {
      session.user.id = user.id;
      return session;
    },
  }
})

export type Session = DefaultSession & {
  accessToken?: string;
  user?: {
    id: string;
  }
}