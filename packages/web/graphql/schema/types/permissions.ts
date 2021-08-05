import { Context } from "@/graphql/context";
import * as prisma from '@prisma/client';

export const hasAuth = (root: any, args: any, ctx: Context) => {
  return !!ctx.user;
}

interface ProjectAccessOptions {
  nullable?: boolean;
  role?: 'ANY' | prisma.ProjectRole;
  projectIdFn?: (root: any, args: any, ctx: Context) => string;
}

export const hasProjectAccess = (options: ProjectAccessOptions = {}) => async (root: any, args: any, ctx: Context) => {
  if (!hasAuth(root, args, ctx)) return false;

  const role = options.role ?? 'ANY';
  const projectIdFn = options.projectIdFn ?? ((_, args) => args.projectId);
  const projectId = projectIdFn(root, args, ctx);
  if (options.nullable && !projectId) return true;

  const userProject = await ctx.prisma.userProject.findUnique({ where: { projectId_userId: { userId: ctx.user!.id, projectId } } });
  if (!userProject) return false;
  if (role == 'ANY') return true;
  return projectRoleMapping[userProject.role].includes(role);
}

export const projectRoleMapping: Record<prisma.ProjectRole, prisma.ProjectRole[]> = {
  ADMIN: ['ADMIN', 'USER'],
  USER: ['USER'],
}