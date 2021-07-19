
import prisma from "@/utils/prisma";
import NextAuth, { DefaultSession } from "next-auth"
import Providers from 'next-auth/providers'
// import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@/utils/PrismaAdapter"


export default NextAuth({
  // Used to debug https://github.com/nextauthjs/next-auth/issues/1664
  // cookies: {
  //   csrfToken: {
  //     name: 'next-auth.csrf-token',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'none',
  //       path: '/',
  //       secure: true
  //     }
  //   },
  //   pkceCodeVerifier: {
  //     name: 'next-auth.pkce.code_verifier',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'none',
  //       path: '/',
  //       secure: true
  //     }
  //   }
  // },
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
      scope: 'user:email, read:user'
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials, req) {
    //     if (credentials.password === "password") {
    //       return {
    //         id: 1,
    //         name: "Fill Murray",
    //         email: "bill@fillmurray.com",
    //         image: "https://www.fillmurray.com/64/64",
    //       }
    //     }
    //     return null
    //   },
    // }),
  ],
  debug: false,
  theme: "light",
  
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    session(session: any, user: any) {
      session.user.id = user.id;
      return session;
    }
  }
})

export type Session = DefaultSession & {
  accessToken?: string;
  user?: {
    id: string;
  }
}