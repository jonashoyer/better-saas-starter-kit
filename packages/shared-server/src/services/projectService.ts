import type { PrismaClient } from "@prisma/client";


export const getProjectUsedSeats = async (prisma: PrismaClient, projectId: string) => {

  const [userProjectCount, userInviteCount] = await Promise.all([
    prisma.userProject.count({ where: { projectId } }),
    prisma.userInvite.count({ where: { projectId } }),
  ]);

  return userProjectCount + userInviteCount;
}