import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GRAPHQL_ENDPOINT, GRAPHQL_WEBSOCKET_ENDPOINT } from '../config';
import { getURL } from '.';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { RetryLink } from "@apollo/client/link/retry";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { sha256 } from 'crypto-hash';
import { OperationDefinitionNode } from 'graphql';

const createHttpLink = (uri: string, headers = {}) => {
  return new HttpLink({
    uri,
    credentials: 'include',
    headers,
    fetch,
  })
}

const createRetyLink = () => {
  return new RetryLink({
    delay: {
      initial: 150,
    },
    attempts(count, operation, error) {
      if ((operation.query.definitions.find(e => e.kind == 'OperationDefinition') as OperationDefinitionNode)?.operation == 'mutation') return false;
      if (3 < count) return false;
      if (error?.statusCode && 400 <= error?.statusCode) return false; 

      return true;
    },
  });
}

const createWebSocketLink = () => {
  if (process.browser) {
    return new GraphQLWsLink(createClient({
      url: GRAPHQL_WEBSOCKET_ENDPOINT,
      connectionParams: {},
    }));
  }
  return null;
}

export const createLink = (baseLink?: ApolloLink, headers = {}) => {

  const persistedLink = createPersistedQueryLink({ sha256 });

  const link =
    (baseLink ? baseLink.concat(persistedLink) : persistedLink)
      .concat(createRetyLink())
      .concat(
        split(
          ({ operationName, getContext }) => {
            //NOTE: Custom logic for splitting between serverless and remote server. Change as see fit.
            return !operationName.toLowerCase().includes('remoteServer') && !getContext().remoteServer;
          },
          createHttpLink(`${getURL()}/api/graphql`, headers),
          createHttpLink(GRAPHQL_ENDPOINT, headers),
        )
      )

  if (process.browser) {
    return split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      createWebSocketLink(),
      link,
    )
  }

  return link;
}

export function createApolloClient(link: ApolloLink) {
  return new ApolloClient({
    link,
    cache: new InMemoryCache({}),
    ssrMode: typeof window === 'undefined',
    ssrForceFetchDelay: 100,
  });
}

export interface InitializeApolloOptions {
  initialState?: any;
  link?: ApolloLink;
  headers?: {};
  baseLink?: ApolloLink;
}

export function initializeApollo({ initialState, link, headers, baseLink }: InitializeApolloOptions) {
  const apolloClient = createApolloClient(link ?? createLink(baseLink, headers))

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    apolloClient.cache.restore(initialState);
  }
  
  return apolloClient;
}