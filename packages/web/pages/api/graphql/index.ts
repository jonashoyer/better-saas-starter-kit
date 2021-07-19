import { ApolloServer } from "apollo-server-micro";
import schema from "../../../graphql/schema";
import { createContext } from '../../../graphql/context';
import depthLimit from 'graphql-depth-limit';

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

export default apolloServer.createHandler({ path: "/api/graphql" });