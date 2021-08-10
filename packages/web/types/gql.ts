import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
export const BaseProjcetFragmentDoc = gql`
    fragment BaseProjcet on Project {
  id
  name
}
    `;
export const CreateProjectDocument = gql`
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    ...BaseProjcet
  }
}
    ${BaseProjcetFragmentDoc}`;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const CurrentProjectDocument = gql`
    query CurrentProject($projectId: String) {
  currentProject(projectId: $projectId) {
    id
    name
  }
}
    `;

/**
 * __useCurrentProjectQuery__
 *
 * To run a query within a React component, call `useCurrentProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useCurrentProjectQuery(baseOptions?: Apollo.QueryHookOptions<CurrentProjectQuery, CurrentProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentProjectQuery, CurrentProjectQueryVariables>(CurrentProjectDocument, options);
      }
export function useCurrentProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentProjectQuery, CurrentProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentProjectQuery, CurrentProjectQueryVariables>(CurrentProjectDocument, options);
        }
export type CurrentProjectQueryHookResult = ReturnType<typeof useCurrentProjectQuery>;
export type CurrentProjectLazyQueryHookResult = ReturnType<typeof useCurrentProjectLazyQuery>;
export type CurrentProjectQueryResult = Apollo.QueryResult<CurrentProjectQuery, CurrentProjectQueryVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: String!) {
  deleteProject(id: $id) {
    id
    name
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
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
export const SelfProjectsDocument = gql`
    query SelfProjects {
  selfProjects {
    id
    name
  }
}
    `;

/**
 * __useSelfProjectsQuery__
 *
 * To run a query within a React component, call `useSelfProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelfProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelfProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSelfProjectsQuery(baseOptions?: Apollo.QueryHookOptions<SelfProjectsQuery, SelfProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SelfProjectsQuery, SelfProjectsQueryVariables>(SelfProjectsDocument, options);
      }
export function useSelfProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelfProjectsQuery, SelfProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SelfProjectsQuery, SelfProjectsQueryVariables>(SelfProjectsDocument, options);
        }
export type SelfProjectsQueryHookResult = ReturnType<typeof useSelfProjectsQuery>;
export type SelfProjectsLazyQueryHookResult = ReturnType<typeof useSelfProjectsLazyQuery>;
export type SelfProjectsQueryResult = Apollo.QueryResult<SelfProjectsQuery, SelfProjectsQueryVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    ...BaseProjcet
  }
}
    ${BaseProjcetFragmentDoc}`;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const SelfQueryDocument = gql`
    query SelfQuery {
  self {
    id
    email
    emailVerified
    name
  }
}
    `;

/**
 * __useSelfQueryQuery__
 *
 * To run a query within a React component, call `useSelfQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelfQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelfQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useSelfQueryQuery(baseOptions?: Apollo.QueryHookOptions<SelfQueryQuery, SelfQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SelfQueryQuery, SelfQueryQueryVariables>(SelfQueryDocument, options);
      }
export function useSelfQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelfQueryQuery, SelfQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SelfQueryQuery, SelfQueryQueryVariables>(SelfQueryDocument, options);
        }
export type SelfQueryQueryHookResult = ReturnType<typeof useSelfQueryQuery>;
export type SelfQueryLazyQueryHookResult = ReturnType<typeof useSelfQueryLazyQuery>;
export type SelfQueryQueryResult = Apollo.QueryResult<SelfQueryQuery, SelfQueryQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  Json: any;
};

export type CheckoutSession = {
  __typename?: 'CheckoutSession';
  sessionId?: Maybe<Scalars['String']>;
};

export type CreateProjectInput = {
  name: Scalars['String'];
};





export type Mutation = {
  __typename?: 'Mutation';
  createCheckoutSession?: Maybe<CheckoutSession>;
  createProject?: Maybe<Project>;
  updateProject?: Maybe<Project>;
  deleteProject?: Maybe<Project>;
};


export type MutationCreateCheckoutSessionArgs = {
  price: Scalars['String'];
  quantity?: Maybe<Scalars['Int']>;
  metadata?: Maybe<Scalars['Json']>;
  projectId: Scalars['String'];
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['String'];
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  brand: Scalars['String'];
  last4: Scalars['String'];
  expMonth: Scalars['Int'];
  expYear: Scalars['Int'];
  type: Scalars['String'];
  importance: PaymentMethodImportance;
  project: Project;
};

export enum PaymentMethodImportance {
  Primary = 'PRIMARY',
  Backup = 'BACKUP',
  Other = 'OTHER'
}

export type PaymentMethodWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['String'];
  name: Scalars['String'];
  users: Array<UserProject>;
  paymentMethods: Array<PaymentMethod>;
};


export type ProjectUsersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<UserProjectWhereUniqueInput>;
  after?: Maybe<UserProjectWhereUniqueInput>;
};


export type ProjectPaymentMethodsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<PaymentMethodWhereUniqueInput>;
  after?: Maybe<PaymentMethodWhereUniqueInput>;
};

export enum ProjectRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Query = {
  __typename?: 'Query';
  currentProject?: Maybe<Project>;
  ping: Scalars['String'];
  self?: Maybe<User>;
  selfProjects?: Maybe<Array<Maybe<Project>>>;
};


export type QueryCurrentProjectArgs = {
  projectId?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  ping?: Maybe<Scalars['DateTime']>;
};

export type UpdateProjectInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  projects: Array<UserProject>;
};


export type UserProjectsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<UserProjectWhereUniqueInput>;
  after?: Maybe<UserProjectWhereUniqueInput>;
};

export type UserProject = {
  __typename?: 'UserProject';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  role: ProjectRole;
  user: User;
  project: Project;
};

export type UserProjectProjectIdUserIdCompoundUniqueInput = {
  projectId: Scalars['String'];
  userId: Scalars['String'];
};

export type UserProjectWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  projectId_userId?: Maybe<UserProjectProjectIdUserIdCompoundUniqueInput>;
};

export type BaseProjcetFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'name'>
);

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject?: Maybe<(
    { __typename?: 'Project' }
    & BaseProjcetFragment
  )> }
);

export type CurrentProjectQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type CurrentProjectQuery = (
  { __typename?: 'Query' }
  & { currentProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name'>
  )> }
);

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name'>
  )> }
);

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'ping'>
);

export type SelfProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfProjectsQuery = (
  { __typename?: 'Query' }
  & { selfProjects?: Maybe<Array<Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name'>
  )>>> }
);

export type UpdateProjectMutationVariables = Exact<{
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject?: Maybe<(
    { __typename?: 'Project' }
    & BaseProjcetFragment
  )> }
);

export type SelfQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfQueryQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'emailVerified' | 'name'>
  )> }
);
