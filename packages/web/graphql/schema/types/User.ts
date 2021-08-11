import { Context } from '@/graphql/context';
import * as prisma from '@prisma/client';
import { objectType, queryField } from 'nexus';
import { hasAuth } from './permissions';

const isSelf = (root: prisma.User, args: any, ctx: Context) => {
  if (!ctx.user?.id) return false;
  const user = root;
  return user.id === ctx.user?.id;
}

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.email({ authorize: isSelf, });
    t.model.emailVerified({ authorize: isSelf });
    t.model.name(); // FIXME: In project with
    t.model.image(); // FIXME: In project with
    t.model.projects({ authorize: isSelf });
  },
});

export const UserSelf = queryField('self', {
  type: 'User',
  nullable: true,
  authorize: hasAuth,
  resolve: async (parent, args, ctx) => {
    return ctx.user;
  },
})