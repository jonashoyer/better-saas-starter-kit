import { Context } from "graphql/context";
import * as prisma from '@prisma/client';
import { fieldAuthorizePluginCore } from "nexus";

type AuthResolver = fieldAuthorizePluginCore.FieldAuthorizeResolver<any, any>;

export const requireAuth: AuthResolver = (root, args, ctx) => {
  return !!ctx.user;
}

export const requireVerifiedEmail = (): AuthResolver => async (root, args, ctx) => {
  return !!ctx.user?.emailVerified;
}

interface ProjectAccessOptions {
  nullable?: boolean;
  role?: 'ANY' | prisma.ProjectRole;
  projectIdFn?: (root: any, args: any, ctx: Context) => string;
}
export const requireProjectAccess = (options: ProjectAccessOptions = {}): AuthResolver => async (root, args, ctx, info) => {
  if (!requireAuth(root, args, ctx, info)) return false;

  const role = options.role ?? 'ANY';
  const projectIdFn = options.projectIdFn ?? ((_, args) => args.projectId);
  const projectId = projectIdFn(root, args, ctx);
  if (options.nullable && !projectId) return true;
  return hasUserProjectAccess(ctx.prisma, ctx.user!.id, projectId, role);
}


export function requireCombine (arr: AuthResolver[]): AuthResolver;
export function requireCombine (...arr: AuthResolver[]): AuthResolver;
export function requireCombine (...arr: ([AuthResolver[]] | AuthResolver[])): AuthResolver {
  if  (arr.length == 0) return () => true;
  const _arr = (Array.isArray(arr[0]) ? arr[0] : arr) as AuthResolver[];

  return (...args) => {
    return _arr.reduce(async (p, resolver) => {
      const result = await p;
      if (result != true) return result;
      return resolver(...args);
    }, Promise.resolve(true));
  }
}

export const hasUserProjectAccess = async (prisma: prisma.PrismaClient, userId: string, projectId: string, role: 'ANY' | prisma.ProjectRole = 'ANY') => {
  const userProject = await prisma.userProject.findUnique({ where: { projectId_userId: { userId, projectId } } });
  if (!userProject) return false;
  if (role == 'ANY') return true;
  return projectRoleMapping[userProject.role].includes(role);
}

export const projectRoleMapping: Record<prisma.ProjectRole, prisma.ProjectRole[]> = {
  ADMIN: ['ADMIN', 'USER'],
  USER: ['USER'],
}