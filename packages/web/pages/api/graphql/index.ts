import { ApolloServer } from "apollo-server-micro";
import schema from "../../../graphql/schema";
import { createContext } from '../../../graphql/context';
import depthLimit from 'graphql-depth-limit';
import { RequestHandler, send } from 'micro'
import createCors from 'micro-cors';
import { NextApiHandler } from "next";

const cors = createCors({
  origin: 'https://studio.apollographql.com',
  allowCredentials: true,
});

const apolloServer = new ApolloServer({
  schema,
  context: createContext,
  validationRules: [depthLimit(4)],
});

export const config = {
  api: {
    bodyParser: false
  }
};

const createHandler = async () => {
  await apolloServer.start();
  const apolloHandler = apolloServer.createHandler({ path: '/api/graphql' });
  return cors((req, res) => req.method === 'OPTIONS' ? send(res, 200, 'ok') : apolloHandler(req, res));
}

let promiseHandler: Promise<RequestHandler>;
const getHandler = async () => {
  if (promiseHandler) return promiseHandler;
  return promiseHandler = createHandler();
}

const requestHandler: NextApiHandler = async (req, res) => (await getHandler())(req, res);

export default requestHandler;