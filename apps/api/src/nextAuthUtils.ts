// !MODULE oauth
import { Session, User } from "@prisma/client"
import { prisma } from "./context"
import cookie from 'cookie';
import http from 'http';
import { authorizeWeb3Token, authorizeAccessToken } from "shared-server";

const SESSION_TOKEN_NAME = 'next-auth.session-token';

export const findSession = async (sessionToken: string ): Promise<(Session & { user: User }) | null> => {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })
  if (session && session.expires < new Date()) {
    await prisma.session.delete({ where: { sessionToken } })
    return null;
  }
  return session;
}



export const getSession = async ({ req, sessionToken }: { req?: { headers: http.IncomingHttpHeaders }, sessionToken?: string }): Promise<(Session & { user: User }) | null> =>  {

  if (sessionToken) {
    return findSession(sessionToken!);
  }
  if (req) {
    const parsed = cookie.parse(req.headers.cookie || '');
    const sessionToken = parsed[SESSION_TOKEN_NAME];
    if (sessionToken) {
      return findSession(sessionToken);
    }
  }
  return null;
};

export const authorize = async ({ req, sessionToken, accessToken }: {
  req?: { headers: http.IncomingHttpHeaders },
  sessionToken?: string,
  accessToken?: string,
}): Promise<(User & { session?: Session }) | null> => {

  if (accessToken) {
    return authorizeAccessToken(prisma, accessToken);
  }
  
  if (req || sessionToken) {
    const session = await getSession({ req, sessionToken } as any);
    if (!session) return null;
    return { ...session.user, session };
  }
  return null;
}