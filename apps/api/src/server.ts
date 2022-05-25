import schema from './schema';
import { NODE_ENV, PORT } from './config';
import { createContext, createSubscriptionContext } from './context';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import depthLimit from 'graphql-depth-limit';
import cors from 'cors';
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { NodeEnv } from 'shared';
import { createRedisClient } from 'shared-server';
import cookieParser from 'cookie-parser';
import bullboardRoute from './routes/bullboard';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';


(async function () {
  
  const app = express();
  const httpServer = http.createServer(app);
  
  app.use(cors({
    credentials: true,
    origin: NODE_ENV === 'production' ? process.env.CORS_ORIGIN : /.*/,
  }));
  
  app.use(rateLimit({
    store: new RedisStore({
      client: createRedisClient('client'),
    }),
    max: 60,
    windowMs: 60000,
  }))
  if (NODE_ENV === 'production') app.set('trust proxy', 1);

  app.use(cookieParser());

  app.use('/admin', bullboardRoute);



  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',

  });

  const serverCleanup = useServer({
    schema,
    context: createSubscriptionContext,
  }, wsServer);

  const apollo = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: createContext,
    validationRules: [depthLimit(4)],
    debug: NODE_ENV === NodeEnv.Development,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          }   
        }
      }
    ]
  });

  await apollo.start();  
  
  apollo.applyMiddleware({ app, cors: false });


  // const subscriptionServer = SubscriptionServer.create(
  //   {
  //     schema, execute, subscribe,
  //     async onConnect(connectionParams: any, websocket: any, ctx: ExpressContext): Promise<Context> {
  //       return createSubscriptionContext(connectionParams, websocket, ctx);
  //     }
  //   },
  //   { server: httpServer, path: apollo.graphqlPath }
  // );
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 GraphQL service ready at http://localhost:${PORT}/graphql`);
  });
  
})();
