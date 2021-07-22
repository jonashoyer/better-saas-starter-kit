import { ApolloServer } from "apollo-server-micro";
import schema from "../../../graphql/schema";
import { createContext } from '../../../graphql/context';
import depthLimit from 'graphql-depth-limit';
import { IncomingMessage, ServerResponse } from 'http';

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

let promise: Promise<any>;
const startServer = () => {
  if (promise) return promise;
  promise = apolloServer.start();
  return promise;
}

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  await startServer();
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export default handler;