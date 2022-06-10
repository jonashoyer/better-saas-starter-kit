import React from 'react';
import { createLink, initializeApollo } from '../utils/GraphqlClient';
import { ServerError } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { userLogout } from '../contexts/UserContext';
import { GraphQLErrors, NetworkError } from '@apollo/client/errors';
import { useLatest } from 'react-use';

export interface UseApolloClientOptions {
  initialState?: any;
  onGraphQLErrors?: (errors: GraphQLErrors) => void;
  onNetworkError?: (error: NetworkError) => void;
}

export function useGraphqlClient(options: UseApolloClientOptions) {

  const onGraphQLErrors = useLatest(options.onGraphQLErrors);
  const onNetworkError = useLatest(options.onNetworkError);

  return React.useMemo(() => {

    const onErrorLink = onError(({ graphQLErrors, networkError }) => {

      if (graphQLErrors) onGraphQLErrors.current?.(graphQLErrors);
      if (networkError) onNetworkError.current?.(networkError);

      if (
        (networkError?.name === 'ServerError' && (networkError as ServerError)?.statusCode === 401)
        || networkError?.message === 'Session not found!'
      ) {
        userLogout();
      }

    });


    const link = createLink(onErrorLink);

    return initializeApollo({ initialState: options.initialState, link });
  }, [onGraphQLErrors, onNetworkError, options.initialState]);
}