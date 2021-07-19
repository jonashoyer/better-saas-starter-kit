import schema from './schema';
import { createContext } from './context';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import depthLimit from 'graphql-depth-limit';
import cors from 'cors';
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from './redis';
import { NodeEnv, NODE_ENV } from './config';
import { authorize } from './nextAuthUtils';

const apollo = new ApolloServer({
  schema,
  context: createContext,
  validationRules: [depthLimit(4)],
  debug: NODE_ENV === NodeEnv.Development,
  subscriptions: {
    path: '/subscriptions',
    async onConnect(connectionParams: any, websocket, ctx) {
        const { accessToken } = connectionParams;
        const user = await authorize({ req: ctx.request, accessToken } as any);
        return { user, accessToken };
    }
  }
});

const app = express();

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(cors({
  credentials: true,
  origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : /.*/,
}));

app.use(rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  max: 60,
  windowMs: 60000,
}))


const server = http.createServer(app);

apollo.applyMiddleware({ app, cors: false });
apollo.installSubscriptionHandlers(server);

server.listen(4000, () => {
  console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`);
});