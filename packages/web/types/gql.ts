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
export const BasePaymenthMethodFragmentDoc = gql`
    fragment BasePaymenthMethod on PaymentMethod {
  id
  createdAt
  brand
  last4
  expMonth
  expYear
  type
  importance
  updatedAt
}
    `;
export const CreateManyUserInviteDocument = gql`
    mutation CreateManyUserInvite($input: CreateUserInviteInput!) {
  createManyUserInvite(input: $input) {
    id
    role
    createdAt
    email
  }
}
    `;
export type CreateManyUserInviteMutationFn = Apollo.MutationFunction<CreateManyUserInviteMutation, CreateManyUserInviteMutationVariables>;

/**
 * __useCreateManyUserInviteMutation__
 *
 * To run a mutation, you first call `useCreateManyUserInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateManyUserInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createManyUserInviteMutation, { data, loading, error }] = useCreateManyUserInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateManyUserInviteMutation(baseOptions?: Apollo.MutationHookOptions<CreateManyUserInviteMutation, CreateManyUserInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateManyUserInviteMutation, CreateManyUserInviteMutationVariables>(CreateManyUserInviteDocument, options);
      }
export type CreateManyUserInviteMutationHookResult = ReturnType<typeof useCreateManyUserInviteMutation>;
export type CreateManyUserInviteMutationResult = Apollo.MutationResult<CreateManyUserInviteMutation>;
export type CreateManyUserInviteMutationOptions = Apollo.BaseMutationOptions<CreateManyUserInviteMutation, CreateManyUserInviteMutationVariables>;
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
export const CreateSetupIntentDocument = gql`
    mutation CreateSetupIntent($projectId: String!) {
  createSetupIntent(projectId: $projectId) {
    clientSecret
  }
}
    `;
export type CreateSetupIntentMutationFn = Apollo.MutationFunction<CreateSetupIntentMutation, CreateSetupIntentMutationVariables>;

/**
 * __useCreateSetupIntentMutation__
 *
 * To run a mutation, you first call `useCreateSetupIntentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSetupIntentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSetupIntentMutation, { data, loading, error }] = useCreateSetupIntentMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useCreateSetupIntentMutation(baseOptions?: Apollo.MutationHookOptions<CreateSetupIntentMutation, CreateSetupIntentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSetupIntentMutation, CreateSetupIntentMutationVariables>(CreateSetupIntentDocument, options);
      }
export type CreateSetupIntentMutationHookResult = ReturnType<typeof useCreateSetupIntentMutation>;
export type CreateSetupIntentMutationResult = Apollo.MutationResult<CreateSetupIntentMutation>;
export type CreateSetupIntentMutationOptions = Apollo.BaseMutationOptions<CreateSetupIntentMutation, CreateSetupIntentMutationVariables>;
export const CurrentProjectDocument = gql`
    query CurrentProject($projectId: String) {
  currentProject(projectId: $projectId) {
    ...BaseProjcet
    subscriptionPlan
  }
}
    ${BaseProjcetFragmentDoc}`;

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
export const CurrentProjectSettingsDocument = gql`
    query CurrentProjectSettings($projectId: String) {
  currentProject(projectId: $projectId) {
    ...BaseProjcet
    subscriptionPlan
    users {
      id
      createdAt
      role
      user {
        id
        createdAt
        name
        image
        email
      }
    }
    userInvites {
      id
      createdAt
      role
      email
    }
    paymentMethods {
      ...BasePaymenthMethod
    }
  }
}
    ${BaseProjcetFragmentDoc}
${BasePaymenthMethodFragmentDoc}`;

/**
 * __useCurrentProjectSettingsQuery__
 *
 * To run a query within a React component, call `useCurrentProjectSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentProjectSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentProjectSettingsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useCurrentProjectSettingsQuery(baseOptions?: Apollo.QueryHookOptions<CurrentProjectSettingsQuery, CurrentProjectSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentProjectSettingsQuery, CurrentProjectSettingsQueryVariables>(CurrentProjectSettingsDocument, options);
      }
export function useCurrentProjectSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentProjectSettingsQuery, CurrentProjectSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentProjectSettingsQuery, CurrentProjectSettingsQueryVariables>(CurrentProjectSettingsDocument, options);
        }
export type CurrentProjectSettingsQueryHookResult = ReturnType<typeof useCurrentProjectSettingsQuery>;
export type CurrentProjectSettingsLazyQueryHookResult = ReturnType<typeof useCurrentProjectSettingsLazyQuery>;
export type CurrentProjectSettingsQueryResult = Apollo.QueryResult<CurrentProjectSettingsQuery, CurrentProjectSettingsQueryVariables>;
export const DeletePaymentMethodDocument = gql`
    mutation DeletePaymentMethod($id: String!) {
  deletePaymentMethod(id: $id) {
    id
  }
}
    `;
export type DeletePaymentMethodMutationFn = Apollo.MutationFunction<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>;

/**
 * __useDeletePaymentMethodMutation__
 *
 * To run a mutation, you first call `useDeletePaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePaymentMethodMutation, { data, loading, error }] = useDeletePaymentMethodMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>(DeletePaymentMethodDocument, options);
      }
export type DeletePaymentMethodMutationHookResult = ReturnType<typeof useDeletePaymentMethodMutation>;
export type DeletePaymentMethodMutationResult = Apollo.MutationResult<DeletePaymentMethodMutation>;
export type DeletePaymentMethodMutationOptions = Apollo.BaseMutationOptions<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: String!) {
  deleteProject(id: $id) {
    ...BaseProjcet
  }
}
    ${BaseProjcetFragmentDoc}`;
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
export const DeleteUserInviteDocument = gql`
    mutation DeleteUserInvite($id: String!) {
  deleteUserInvite(id: $id) {
    id
  }
}
    `;
export type DeleteUserInviteMutationFn = Apollo.MutationFunction<DeleteUserInviteMutation, DeleteUserInviteMutationVariables>;

/**
 * __useDeleteUserInviteMutation__
 *
 * To run a mutation, you first call `useDeleteUserInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserInviteMutation, { data, loading, error }] = useDeleteUserInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserInviteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserInviteMutation, DeleteUserInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserInviteMutation, DeleteUserInviteMutationVariables>(DeleteUserInviteDocument, options);
      }
export type DeleteUserInviteMutationHookResult = ReturnType<typeof useDeleteUserInviteMutation>;
export type DeleteUserInviteMutationResult = Apollo.MutationResult<DeleteUserInviteMutation>;
export type DeleteUserInviteMutationOptions = Apollo.BaseMutationOptions<DeleteUserInviteMutation, DeleteUserInviteMutationVariables>;
export const DeleteUserProjectDocument = gql`
    mutation DeleteUserProject($id: String!) {
  deleteUserProject(id: $id) {
    id
  }
}
    `;
export type DeleteUserProjectMutationFn = Apollo.MutationFunction<DeleteUserProjectMutation, DeleteUserProjectMutationVariables>;

/**
 * __useDeleteUserProjectMutation__
 *
 * To run a mutation, you first call `useDeleteUserProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserProjectMutation, { data, loading, error }] = useDeleteUserProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserProjectMutation, DeleteUserProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserProjectMutation, DeleteUserProjectMutationVariables>(DeleteUserProjectDocument, options);
      }
export type DeleteUserProjectMutationHookResult = ReturnType<typeof useDeleteUserProjectMutation>;
export type DeleteUserProjectMutationResult = Apollo.MutationResult<DeleteUserProjectMutation>;
export type DeleteUserProjectMutationOptions = Apollo.BaseMutationOptions<DeleteUserProjectMutation, DeleteUserProjectMutationVariables>;
export const GetCurrentProjectSubscriptionPlanDocument = gql`
    query GetCurrentProjectSubscriptionPlan {
  currentProject {
    id
    subscriptionPlan
  }
}
    `;

/**
 * __useGetCurrentProjectSubscriptionPlanQuery__
 *
 * To run a query within a React component, call `useGetCurrentProjectSubscriptionPlanQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentProjectSubscriptionPlanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentProjectSubscriptionPlanQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentProjectSubscriptionPlanQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentProjectSubscriptionPlanQuery, GetCurrentProjectSubscriptionPlanQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentProjectSubscriptionPlanQuery, GetCurrentProjectSubscriptionPlanQueryVariables>(GetCurrentProjectSubscriptionPlanDocument, options);
      }
export function useGetCurrentProjectSubscriptionPlanLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentProjectSubscriptionPlanQuery, GetCurrentProjectSubscriptionPlanQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentProjectSubscriptionPlanQuery, GetCurrentProjectSubscriptionPlanQueryVariables>(GetCurrentProjectSubscriptionPlanDocument, options);
        }
export type GetCurrentProjectSubscriptionPlanQueryHookResult = ReturnType<typeof useGetCurrentProjectSubscriptionPlanQuery>;
export type GetCurrentProjectSubscriptionPlanLazyQueryHookResult = ReturnType<typeof useGetCurrentProjectSubscriptionPlanLazyQuery>;
export type GetCurrentProjectSubscriptionPlanQueryResult = Apollo.QueryResult<GetCurrentProjectSubscriptionPlanQuery, GetCurrentProjectSubscriptionPlanQueryVariables>;
export const GetPaymentMethodsDocument = gql`
    query GetPaymentMethods($projectId: String) {
  currentProject(projectId: $projectId) {
    id
    paymentMethods {
      ...BasePaymenthMethod
    }
  }
}
    ${BasePaymenthMethodFragmentDoc}`;

/**
 * __useGetPaymentMethodsQuery__
 *
 * To run a query within a React component, call `useGetPaymentMethodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentMethodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentMethodsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetPaymentMethodsQuery(baseOptions?: Apollo.QueryHookOptions<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(GetPaymentMethodsDocument, options);
      }
export function useGetPaymentMethodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(GetPaymentMethodsDocument, options);
        }
export type GetPaymentMethodsQueryHookResult = ReturnType<typeof useGetPaymentMethodsQuery>;
export type GetPaymentMethodsLazyQueryHookResult = ReturnType<typeof useGetPaymentMethodsLazyQuery>;
export type GetPaymentMethodsQueryResult = Apollo.QueryResult<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>;
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
export const SelfDocument = gql`
    query Self {
  self {
    id
    email
    emailVerified
    name
  }
}
    `;

/**
 * __useSelfQuery__
 *
 * To run a query within a React component, call `useSelfQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelfQuery({
 *   variables: {
 *   },
 * });
 */
export function useSelfQuery(baseOptions?: Apollo.QueryHookOptions<SelfQuery, SelfQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SelfQuery, SelfQueryVariables>(SelfDocument, options);
      }
export function useSelfLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelfQuery, SelfQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SelfQuery, SelfQueryVariables>(SelfDocument, options);
        }
export type SelfQueryHookResult = ReturnType<typeof useSelfQuery>;
export type SelfLazyQueryHookResult = ReturnType<typeof useSelfLazyQuery>;
export type SelfQueryResult = Apollo.QueryResult<SelfQuery, SelfQueryVariables>;
export const UpdatePaymentMethodDocument = gql`
    mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
  updatePaymentMethod(input: $input) {
    id
    updatedAt
    importance
  }
}
    `;
export type UpdatePaymentMethodMutationFn = Apollo.MutationFunction<UpdatePaymentMethodMutation, UpdatePaymentMethodMutationVariables>;

/**
 * __useUpdatePaymentMethodMutation__
 *
 * To run a mutation, you first call `useUpdatePaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePaymentMethodMutation, { data, loading, error }] = useUpdatePaymentMethodMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePaymentMethodMutation, UpdatePaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePaymentMethodMutation, UpdatePaymentMethodMutationVariables>(UpdatePaymentMethodDocument, options);
      }
export type UpdatePaymentMethodMutationHookResult = ReturnType<typeof useUpdatePaymentMethodMutation>;
export type UpdatePaymentMethodMutationResult = Apollo.MutationResult<UpdatePaymentMethodMutation>;
export type UpdatePaymentMethodMutationOptions = Apollo.BaseMutationOptions<UpdatePaymentMethodMutation, UpdatePaymentMethodMutationVariables>;
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
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    name
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserProjectDocument = gql`
    mutation UpdateUserProject($input: UpdateUserProjectInput!) {
  updateUserProject(input: $input) {
    id
    createdAt
    role
  }
}
    `;
export type UpdateUserProjectMutationFn = Apollo.MutationFunction<UpdateUserProjectMutation, UpdateUserProjectMutationVariables>;

/**
 * __useUpdateUserProjectMutation__
 *
 * To run a mutation, you first call `useUpdateUserProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProjectMutation, { data, loading, error }] = useUpdateUserProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProjectMutation, UpdateUserProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProjectMutation, UpdateUserProjectMutationVariables>(UpdateUserProjectDocument, options);
      }
export type UpdateUserProjectMutationHookResult = ReturnType<typeof useUpdateUserProjectMutation>;
export type UpdateUserProjectMutationResult = Apollo.MutationResult<UpdateUserProjectMutation>;
export type UpdateUserProjectMutationOptions = Apollo.BaseMutationOptions<UpdateUserProjectMutation, UpdateUserProjectMutationVariables>;
export const UpsertSubscriptionDocument = gql`
    mutation UpsertSubscription($input: UpsertSubscriptionInput!) {
  upsertSubscription(input: $input) {
    id
    metadata
    status
    priceId
    quantity
    cancelAtPeriodEnd
    cancelAt
    canceledAt
    currentPeriodStart
    currentPeriodEnd
    created
    endedAt
  }
}
    `;
export type UpsertSubscriptionMutationFn = Apollo.MutationFunction<UpsertSubscriptionMutation, UpsertSubscriptionMutationVariables>;

/**
 * __useUpsertSubscriptionMutation__
 *
 * To run a mutation, you first call `useUpsertSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertSubscriptionMutation, { data, loading, error }] = useUpsertSubscriptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpsertSubscriptionMutation(baseOptions?: Apollo.MutationHookOptions<UpsertSubscriptionMutation, UpsertSubscriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertSubscriptionMutation, UpsertSubscriptionMutationVariables>(UpsertSubscriptionDocument, options);
      }
export type UpsertSubscriptionMutationHookResult = ReturnType<typeof useUpsertSubscriptionMutation>;
export type UpsertSubscriptionMutationResult = Apollo.MutationResult<UpsertSubscriptionMutation>;
export type UpsertSubscriptionMutationOptions = Apollo.BaseMutationOptions<UpsertSubscriptionMutation, UpsertSubscriptionMutationVariables>;
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

export type BillingInfomation = {
  __typename?: 'BillingInfomation';
  currentPrice: Scalars['String'];
  currentQuantity: Scalars['Int'];
  latestInvoice: Invoice;
  upcomingInvoice: Invoice;
};

export type CheckoutSession = {
  __typename?: 'CheckoutSession';
  sessionId?: Maybe<Scalars['String']>;
};

export type CreateProjectInput = {
  name: Scalars['String'];
};

export type CreateUserInviteInput = {
  emails: Array<Scalars['String']>;
  projectId: Scalars['String'];
  role: ProjectRole;
};



export type Invoice = {
  __typename?: 'Invoice';
  id: Scalars['String'];
  created: Scalars['DateTime'];
  dueDate?: Maybe<Scalars['DateTime']>;
  status: InvoiceStatus;
  amountDue: Scalars['Int'];
  amountPaid: Scalars['Int'];
  amountRemaining: Scalars['Int'];
  billingReason?: Maybe<InvoiceBillingReason>;
  invoicePdf?: Maybe<Scalars['String']>;
  periodStart: Scalars['DateTime'];
  periodEnd: Scalars['DateTime'];
  receiptNumber?: Maybe<Scalars['String']>;
  subtotal: Scalars['Int'];
  tax?: Maybe<Scalars['Int']>;
  total: Scalars['Int'];
};

export enum InvoiceBillingReason {
  AutomaticPendingInvoiceItemInvoice = 'AUTOMATIC_PENDING_INVOICE_ITEM_INVOICE',
  Manual = 'MANUAL',
  QuoteAccept = 'QUOTE_ACCEPT',
  Subscription = 'SUBSCRIPTION',
  SubscriptionCreate = 'SUBSCRIPTION_CREATE',
  SubscriptionCycle = 'SUBSCRIPTION_CYCLE',
  SubscriptionThreshold = 'SUBSCRIPTION_THRESHOLD',
  SubscriptionUpdate = 'SUBSCRIPTION_UPDATE',
  Upcoming = 'UPCOMING'
}

export enum InvoiceStatus {
  Deleted = 'DELETED',
  Draft = 'DRAFT',
  Open = 'OPEN',
  Paid = 'PAID',
  Uncollectible = 'UNCOLLECTIBLE',
  Void = 'VOID'
}



export type Mutation = {
  __typename?: 'Mutation';
  updateUser?: Maybe<User>;
  sendVerifyEmail?: Maybe<StatusResponse>;
  verifyEmail?: Maybe<User>;
  createCheckoutSession?: Maybe<CheckoutSession>;
  createProject?: Maybe<Project>;
  updateProject?: Maybe<Project>;
  deleteProject?: Maybe<Project>;
  updateTaxId?: Maybe<Ok>;
  deleteTaxId?: Maybe<Ok>;
  createSetupIntent?: Maybe<SetupIntent>;
  updatePaymentMethod?: Maybe<PaymentMethod>;
  deletePaymentMethod?: Maybe<PaymentMethod>;
  updateUserProject?: Maybe<UserProject>;
  deleteUserProject?: Maybe<UserProject>;
  createManyUserInvite?: Maybe<Array<Maybe<UserInvite>>>;
  deleteUserInvite?: Maybe<UserInvite>;
  upsertSubscription?: Maybe<StripeSubscription>;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationSendVerifyEmailArgs = {
  email: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
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


export type MutationUpdateTaxIdArgs = {
  input: UpdateTaxIdInput;
};


export type MutationDeleteTaxIdArgs = {
  projectId: Scalars['String'];
};


export type MutationCreateSetupIntentArgs = {
  projectId: Scalars['String'];
};


export type MutationUpdatePaymentMethodArgs = {
  input: UpdatePaymentMethodInput;
};


export type MutationDeletePaymentMethodArgs = {
  id: Scalars['String'];
};


export type MutationUpdateUserProjectArgs = {
  input: UpdateUserProjectInput;
};


export type MutationDeleteUserProjectArgs = {
  id: Scalars['String'];
};


export type MutationCreateManyUserInviteArgs = {
  input: CreateUserInviteInput;
};


export type MutationDeleteUserInviteArgs = {
  id: Scalars['String'];
};


export type MutationUpsertSubscriptionArgs = {
  input: UpsertSubscriptionInput;
};

export type Ok = {
  __typename?: 'Ok';
  ok: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
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
  subscriptionPlan: SubscriptionPlan;
  paymentMethods: Array<PaymentMethod>;
  userInvites: Array<UserInvite>;
};


export type ProjectUsersArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  cursor?: Maybe<UserProjectWhereUniqueInput>;
};


export type ProjectPaymentMethodsArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  cursor?: Maybe<PaymentMethodWhereUniqueInput>;
};


export type ProjectUserInvitesArgs = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  cursor?: Maybe<UserInviteWhereUniqueInput>;
};

export enum ProjectRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Query = {
  __typename?: 'Query';
  currentProject?: Maybe<Project>;
  getBillingInfomation?: Maybe<BillingInfomation>;
  getUserInvites?: Maybe<Array<Maybe<UserInvite>>>;
  ping: Scalars['String'];
  self?: Maybe<User>;
  selfProjects?: Maybe<Array<Maybe<Project>>>;
};


export type QueryCurrentProjectArgs = {
  projectId?: Maybe<Scalars['String']>;
};


export type QueryGetBillingInfomationArgs = {
  subscriptionId: Scalars['String'];
};


export type QueryGetUserInvitesArgs = {
  projectId: Scalars['String'];
};

export type SetupIntent = {
  __typename?: 'SetupIntent';
  clientSecret: Scalars['String'];
};

export type StatusResponse = {
  __typename?: 'StatusResponse';
  ok?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
};

export type StripeSubscription = {
  __typename?: 'StripeSubscription';
  id: Scalars['String'];
  metadata: Scalars['Json'];
  status: StripeSubscriptionStatus;
  priceId: Scalars['String'];
  quantity: Scalars['Int'];
  cancelAtPeriodEnd: Scalars['Boolean'];
  cancelAt?: Maybe<Scalars['DateTime']>;
  canceledAt?: Maybe<Scalars['DateTime']>;
  currentPeriodStart: Scalars['DateTime'];
  currentPeriodEnd: Scalars['DateTime'];
  created: Scalars['DateTime'];
  endedAt?: Maybe<Scalars['DateTime']>;
};

export enum StripeSubscriptionStatus {
  Incomplete = 'INCOMPLETE',
  IncompleteExpired = 'INCOMPLETE_EXPIRED',
  Trialing = 'TRIALING',
  Active = 'ACTIVE',
  PastDue = 'PAST_DUE',
  Canceled = 'CANCELED',
  Unpaid = 'UNPAID'
}

export type Subscription = {
  __typename?: 'Subscription';
  ping?: Maybe<Scalars['DateTime']>;
};

export enum SubscriptionPlan {
  Free = 'FREE',
  Basic = 'BASIC',
  Premium = 'PREMIUM'
}

export enum TaxType {
  AeTrn = 'AE_TRN',
  AuAbn = 'AU_ABN',
  AuArn = 'AU_ARN',
  BrCnpj = 'BR_CNPJ',
  BrCpf = 'BR_CPF',
  CaBn = 'CA_BN',
  CaGstHst = 'CA_GST_HST',
  CaPstBc = 'CA_PST_BC',
  CaPstMb = 'CA_PST_MB',
  CaPstSk = 'CA_PST_SK',
  CaQst = 'CA_QST',
  ChVat = 'CH_VAT',
  ClTin = 'CL_TIN',
  EsCif = 'ES_CIF',
  EuVat = 'EU_VAT',
  GbVat = 'GB_VAT',
  HkBr = 'HK_BR',
  IdNpwp = 'ID_NPWP',
  IlVat = 'IL_VAT',
  InGst = 'IN_GST',
  JpCn = 'JP_CN',
  JpRn = 'JP_RN',
  KrBrn = 'KR_BRN',
  LiUid = 'LI_UID',
  MxRfc = 'MX_RFC',
  MyFrp = 'MY_FRP',
  MyItn = 'MY_ITN',
  MySst = 'MY_SST',
  NoVat = 'NO_VAT',
  NzGst = 'NZ_GST',
  RuInn = 'RU_INN',
  RuKpp = 'RU_KPP',
  SaVat = 'SA_VAT',
  SgGst = 'SG_GST',
  SgUen = 'SG_UEN',
  ThVat = 'TH_VAT',
  TwVat = 'TW_VAT',
  UsEin = 'US_EIN',
  ZaVat = 'ZA_VAT'
}

export type UpdatePaymentMethodInput = {
  id: Scalars['String'];
  importance?: Maybe<PaymentMethodImportance>;
};

export type UpdateProjectInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateTaxIdInput = {
  projectId: Scalars['String'];
  taxType: TaxType;
  taxId: Scalars['String'];
};

export type UpdateUserInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateUserProjectInput = {
  id: Scalars['String'];
  role?: Maybe<ProjectRole>;
};

export type UpsertSubscriptionInput = {
  projectId: Scalars['String'];
  priceId: Scalars['String'];
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
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  cursor?: Maybe<UserProjectWhereUniqueInput>;
};

export type UserInvite = {
  __typename?: 'UserInvite';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  role: ProjectRole;
  email: Scalars['String'];
};

export type UserInviteProjectIdEmailCompoundUniqueInput = {
  projectId: Scalars['String'];
  email: Scalars['String'];
};

export type UserInviteWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  projectId_email?: Maybe<UserInviteProjectIdEmailCompoundUniqueInput>;
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

export type VerificationEmail = {
  __typename?: 'VerificationEmail';
  id: Scalars['String'];
};

export type BaseProjcetFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'name'>
);

export type CreateManyUserInviteMutationVariables = Exact<{
  input: CreateUserInviteInput;
}>;


export type CreateManyUserInviteMutation = (
  { __typename?: 'Mutation' }
  & { createManyUserInvite?: Maybe<Array<Maybe<(
    { __typename?: 'UserInvite' }
    & Pick<UserInvite, 'id' | 'role' | 'createdAt' | 'email'>
  )>>> }
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

export type CreateSetupIntentMutationVariables = Exact<{
  projectId: Scalars['String'];
}>;


export type CreateSetupIntentMutation = (
  { __typename?: 'Mutation' }
  & { createSetupIntent?: Maybe<(
    { __typename?: 'SetupIntent' }
    & Pick<SetupIntent, 'clientSecret'>
  )> }
);

export type CurrentProjectQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type CurrentProjectQuery = (
  { __typename?: 'Query' }
  & { currentProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'subscriptionPlan'>
    & BaseProjcetFragment
  )> }
);

export type CurrentProjectSettingsQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type CurrentProjectSettingsQuery = (
  { __typename?: 'Query' }
  & { currentProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'subscriptionPlan'>
    & { users: Array<(
      { __typename?: 'UserProject' }
      & Pick<UserProject, 'id' | 'createdAt' | 'role'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'createdAt' | 'name' | 'image' | 'email'>
      ) }
    )>, userInvites: Array<(
      { __typename?: 'UserInvite' }
      & Pick<UserInvite, 'id' | 'createdAt' | 'role' | 'email'>
    )>, paymentMethods: Array<(
      { __typename?: 'PaymentMethod' }
      & BasePaymenthMethodFragment
    )> }
    & BaseProjcetFragment
  )> }
);

export type DeletePaymentMethodMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeletePaymentMethodMutation = (
  { __typename?: 'Mutation' }
  & { deletePaymentMethod?: Maybe<(
    { __typename?: 'PaymentMethod' }
    & Pick<PaymentMethod, 'id'>
  )> }
);

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteProject?: Maybe<(
    { __typename?: 'Project' }
    & BaseProjcetFragment
  )> }
);

export type DeleteUserInviteMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteUserInviteMutation = (
  { __typename?: 'Mutation' }
  & { deleteUserInvite?: Maybe<(
    { __typename?: 'UserInvite' }
    & Pick<UserInvite, 'id'>
  )> }
);

export type DeleteUserProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteUserProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteUserProject?: Maybe<(
    { __typename?: 'UserProject' }
    & Pick<UserProject, 'id'>
  )> }
);

export type GetCurrentProjectSubscriptionPlanQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentProjectSubscriptionPlanQuery = (
  { __typename?: 'Query' }
  & { currentProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'subscriptionPlan'>
  )> }
);

export type GetPaymentMethodsQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type GetPaymentMethodsQuery = (
  { __typename?: 'Query' }
  & { currentProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { paymentMethods: Array<(
      { __typename?: 'PaymentMethod' }
      & BasePaymenthMethodFragment
    )> }
  )> }
);

export type BasePaymenthMethodFragment = (
  { __typename?: 'PaymentMethod' }
  & Pick<PaymentMethod, 'id' | 'createdAt' | 'brand' | 'last4' | 'expMonth' | 'expYear' | 'type' | 'importance' | 'updatedAt'>
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

export type SelfQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'emailVerified' | 'name'>
  )> }
);

export type UpdatePaymentMethodMutationVariables = Exact<{
  input: UpdatePaymentMethodInput;
}>;


export type UpdatePaymentMethodMutation = (
  { __typename?: 'Mutation' }
  & { updatePaymentMethod?: Maybe<(
    { __typename?: 'PaymentMethod' }
    & Pick<PaymentMethod, 'id' | 'updatedAt' | 'importance'>
  )> }
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

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name'>
  )> }
);

export type UpdateUserProjectMutationVariables = Exact<{
  input: UpdateUserProjectInput;
}>;


export type UpdateUserProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateUserProject?: Maybe<(
    { __typename?: 'UserProject' }
    & Pick<UserProject, 'id' | 'createdAt' | 'role'>
  )> }
);

export type UpsertSubscriptionMutationVariables = Exact<{
  input: UpsertSubscriptionInput;
}>;


export type UpsertSubscriptionMutation = (
  { __typename?: 'Mutation' }
  & { upsertSubscription?: Maybe<(
    { __typename?: 'StripeSubscription' }
    & Pick<StripeSubscription, 'id' | 'metadata' | 'status' | 'priceId' | 'quantity' | 'cancelAtPeriodEnd' | 'cancelAt' | 'canceledAt' | 'currentPeriodStart' | 'currentPeriodEnd' | 'created' | 'endedAt'>
  )> }
);
