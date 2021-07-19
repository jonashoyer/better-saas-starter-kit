import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}

export const PingDocument = gql`
    query Ping {
  ping
}
    `;

/**
 * __usePingQuery__
 *
 * To run a query within a React component, call `usePingQuery` and pass it any options that fit your needs.
 * When your component renders, `usePingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePingQuery({
 *   variables: {
 *   },
 * });
 */
export function usePingQuery(baseOptions?: Apollo.QueryHookOptions<PingQuery, PingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PingQuery, PingQueryVariables>(PingDocument, options);
      }
export function usePingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PingQuery, PingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PingQuery, PingQueryVariables>(PingDocument, options);
        }
export type PingQueryHookResult = ReturnType<typeof usePingQuery>;
export type PingLazyQueryHookResult = ReturnType<typeof usePingLazyQuery>;
export type PingQueryResult = Apollo.QueryResult<PingQuery, PingQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};



export type Query = {
  __typename?: 'Query';
  ping: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  ping?: Maybe<Scalars['DateTime']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'ping'>
);
