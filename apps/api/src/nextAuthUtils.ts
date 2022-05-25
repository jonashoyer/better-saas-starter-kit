// !MODULE oauth
import { Session, User } from "@prisma/client"
import { prisma } from "./context"
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { AUTH_SECRET } from "./config";
import http from 'http';

const SESSION_TOKEN_NAME = 'next-auth.session-token';

export async function findSession(sessionToken: string ): Promise<(Session & { user: User }) | null> {
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


export async function authorizeAccessToken(accessToken: string) {
  const decoded = jwt.verify(accessToken, AUTH_SECRET);
  if (typeof decoded != 'object') return null;
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });
  return user;
}

export async function getSession({ req, sessionToken }: { req?: {  headers: http.IncomingHttpHeaders }, sessionToken?: string }): Promise<(Session & { user: User }) | null> {

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

export async function authorize({ req, sessionToken, accessToken }: {
  req?: { headers: http.IncomingHttpHeaders },
  sessionToken?: string,
  accessToken?: string,
}): Promise<(User & { session?: Session }) | null> {

  if (accessToken) {
    return authorizeAccessToken(accessToken);
  }
  
  if (req || sessionToken) {
    const session = await getSession({ req, sessionToken } as any);
    if (!session) return null;
    return { ...session.user, session };
  }
  return null;
}