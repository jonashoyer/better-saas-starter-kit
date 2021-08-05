import { PrismaClient } from '@prisma/client';


export const getSession = async (prisma: PrismaClient, sessionToken: string) => {

  // TODO: Caching layer...
  
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