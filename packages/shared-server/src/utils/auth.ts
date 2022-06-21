import type * as Prisma from "@prisma/client"
import type { Profile } from "next-auth"
import { PrismaClient } from '@prisma/client';
import w3t from "web3token";
import Web3 from 'web3';
import { Constants, isJWT } from "shared";
import { createUserWithProject } from '../services/userService';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, NEXT_AUTH_SECRET } from "../config";

export const getSession = async (prisma: PrismaClient, sessionToken: string) => {

  // TODO: Caching layer...

  if (isJWT(sessionToken)) {
    const tok = verifyNextAuthJWT(sessionToken);
    return {
      sessionToken,
      userId: tok.sub!,
      expires: new Date(tok.exp! * 1000),
      user: { id: tok.sub! },
    }
  }
  
  const session = await prisma.session.findUnique({
    where: { sessionToken },
  })
  
  if (!session) return null;

  if (session && session.expires < new Date()) {
    await prisma.session.delete({ where: { sessionToken } });
    return null;
  }

  return session;
}

export const verifyNextAuthJWT = (tok: string) => {
  return jwt.verify(tok, NEXT_AUTH_SECRET) as jwt.JwtPayload;
}

export const getUserProjectRole = async (prisma: PrismaClient, userId: string, projectId: string) => {

  //TODO: Caching layer...

  const userProject = await prisma.userProject.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId
      }
    },
    select: {
      role: true,
    }
  })

  return userProject?.role ?? null;
}


export const authorizeWeb3Token = async (prisma: PrismaClient, token: string) => {

  const decoded = await w3t.verify(new Web3(), token, { statement: Constants.WEB3_TOKEN_STATEMENT });
  
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'w3t',
        providerAccountId: decoded.address,
      }
    },
    include: {
      user: true,
    },
  });

  if (!account) {

    const profile: Profile = {
      name: decoded.address.slice(0, 8),
    } 

    const newAccount: Prisma.Prisma.AccountCreateWithoutUserInput = {
      type: 'web3',
      provider: 'w3t',
      providerAccountId: decoded.address,
    }

    const { user } = await createUserWithProject(prisma, profile, newAccount);

    return { user, decoded };
  }
  
  return { user: account.user, decoded: null };
}


export const authorizeAccessToken = async (prisma: PrismaClient, accessToken: string) => {
  const decoded = jwt.verify(accessToken, JWT_SECRET);
  if (typeof decoded != 'object') return null;
  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
  });
  return user;
}