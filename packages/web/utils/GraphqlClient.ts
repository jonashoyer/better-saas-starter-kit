import React from 'react';
import { ApolloClient, InMemoryCache, NormalizedCacheObject, ServerError, HttpLink, split } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { signOut } from 'next-auth/client';
import { GRAPHQL_ENDPOINT, GRAPHQL_WEBSOCKET_ENDPOINT } from '../config';
import { getURL } from './utils';

export let apolloClient: ApolloClient<NormalizedCacheObject>;

// remove cached token on 401 from the server
const graphqlOnError = onError(({ graphQLErrors, networkError }) => {

  if (
    (networkError?.name === 'ServerError' && (networkError as ServerError)?.statusCode === 401)
    || networkError?.message === 'Session not found!'
    ) {
    signOut();
  }
})

export const memoryCache = new InMemoryCache({});
const createHttpLink = (uri: string, headers = {}) => {
  return  new HttpLink({
    uri,
    credentials: 'include',
    headers,
    fetch,
  })
}

const createWebSocketLink = () => {
  if (process.browser) {
    return new WebSocketLink(
      new SubscriptionClient(
        GRAPHQL_WEBSOCKET_ENDPOINT,
        {
          timeout: 10e3,
          lazy: true,
          reconnect: true,
        })
    );
  }
  return null;
}

const createLink = (headers = {}) => {

  const httpLinkSplit = split(
    ({ operationName, getContext }) => {
      //NOTE: Custom logic for splitting between serverless and remote server. Change as see fit.
      return !operationName.toLowerCase().includes('serverless') && !getContext().serverless;
    },
    createHttpLink(GRAPHQL_ENDPOINT, headers),
    createHttpLink(`${getURL()}/api/graphql`, headers),
  );

  if(process.browser) {
    return split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      graphqlOnError.concat(createWebSocketLink() as WebSocketLink),
      httpLinkSplit,
    )
  }

  return httpLinkSplit;
}

export function createApolloClient(headers = {}) {
  return new ApolloClient({
    link: createLink(headers),
    cache: memoryCache,
    ssrMode: typeof window === 'undefined',
    ssrForceFetchDelay: 100,
  });
}

export function initializeApollo(initialState: any = null, headers = {}) {
  const _apolloClient = apolloClient ?? createApolloClient(headers)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  return React.useMemo(() => initializeApollo(initialState), [initialState]);
}