import { PrismaClient } from '@prisma/client';
import { CachedDataloader } from "./CachedDataloader";
import { createRedisClient } from "./redisClient";


export class Dataloaders {
  private static instance: Dataloaders;

  private loaders: ReturnType<typeof createLoaders>;

  constructor(prisma: PrismaClient) {
    this.loaders = createLoaders(prisma);
  }

  public static getLoaders(prisma: PrismaClient) {
    return Dataloaders.getInstance(prisma).loaders;
  }

  public static getInstance(prisma: PrismaClient) {
    if (!Dataloaders.instance) Dataloaders.instance = new Dataloaders(prisma);
    return Dataloaders.instance;
  }
}

const createLoaders = (prisma: PrismaClient) => ({
  authUserLoader: new CachedDataloader({
    cacheOptions: {
      client: createRedisClient('client'),
      keyPrefix: 'c:auth-user:',
      defaultSetOptions: { ttl: 30 },
    },
    async query(keys) {
      if (keys.length == 1) {
        const user = await prisma.user.findUnique({ where: { id: keys[0] } });
        return [user];
      }
      const result = await prisma.user.findMany({ where: { id: { in: keys } } });
      return keys.map(id => result.find(e => e.id === id));
    },
  }),
  sessionLoader: new CachedDataloader({
    cacheOptions: {
      client: createRedisClient('client'),
      keyPrefix: 'c:session:',
      defaultSetOptions: { ttl: 30 },
    },
    async query(keys) {
      if (keys.length == 1) {
        const session = await prisma.session.findUnique({
          where: { sessionToken: keys[0] },
          include: { user: true },
        });
        return [session];
      }

      const result = await prisma.session.findMany({
        where: { sessionToken: { in: keys } },
        include: { user: true },
      });
      return keys.map(id => result.find(e => e.id === id));
    }
  }),
  w3tAccount: new CachedDataloader({
    cacheOptions: {
      client: createRedisClient('client'),
      keyPrefix: 'c:w3t-account:',
      defaultSetOptions: { ttl: 30 },
    },
    async query(keys) {
      return Promise.all(
        keys.map(id => {
          return prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'w3t',
                providerAccountId: id,
              }
            },
            include: { user: true },
          });
        })
      )
    }
  }),
  userProject: new CachedDataloader<{ userId: string, projectId: string }>({
    cacheOptions: {
      client: createRedisClient('client'),
      keyPrefix: 'c:user-project:',
      defaultSetOptions: { ttl: 60 },
    },
    keyStringify({ projectId, userId }) {
      return `${projectId}:${userId}`;
    },
    async query(keys) {
      return Promise.all(
        keys.map(({ projectId, userId }) => {
          return prisma.userProject.findUnique({
            where: {
              projectId_userId: {
                projectId,
                userId
              }
            },
            select: {
              role: true,
            }
          });
        })
      );
    }
  }),
})