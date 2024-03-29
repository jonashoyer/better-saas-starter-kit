import type { PrismaClient } from "@prisma/client";


export const getProjectUsedSeats = async (prisma: PrismaClient, projectId: string) => {

  if (!projectId) throw new Error('ProjectId not specified');

  const [userProjectCount, userInviteCount] = await Promise.all([
    prisma.userProject.count({ where: { projectId } }),
    prisma.userInvite.count({ where: { projectId } }),
  ]);

  console.log({
    projectId,
    userProjectCount,
    userInviteCount,
  });

  return userProjectCount + userInviteCount;
}