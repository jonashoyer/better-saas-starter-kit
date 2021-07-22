import schema from './schema';
import { execute, subscribe } from "graphql";
import { Context, createContext, createSubscriptionContext } from './context';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { SubscriptionServer } from "subscriptions-transport-ws";
import express from 'express';
import http from 'http';
import depthLimit from 'graphql-depth-limit';
import cors from 'cors';
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { NodeEnv, redisClient } from 'bs-shared-kit';
import { NODE_ENV, PORT } from './config';

(async function () {
  
  const app = express();
  const httpServer = http.createServer(app);
  
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
  if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

  const apollo = new ApolloServer({
    schema,
    context: createContext,
    validationRules: [depthLimit(4)],
    debug: NODE_ENV === NodeEnv.Development
  });

  await apollo.start();  
  
  apollo.applyMiddleware({ app, cors: false });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema, execute, subscribe,
      async onConnect(connectionParams: any, websocket: any, ctx: ExpressContext): Promise<Context> {
        return createSubscriptionContext(connectionParams, websocket, ctx);
      }
    },
    { server: httpServer, path: apollo.graphqlPath }
  );
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 GraphQL service ready at http://localhost:${PORT}/graphql`);
  });
  
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, async () => {
      console.log('Kill signal!');

      subscriptionServer.close();
    });
  });

})();
