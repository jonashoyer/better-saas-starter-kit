import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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

export type CreateUserInviteInput = {
  emails: Array<Scalars['String']>;
  projectId: Scalars['String'];
  role: ProjectRole;
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
  cancelSubscriptionDowngrade?: Maybe<StripeSubscription>;
  createCheckoutSession?: Maybe<CheckoutSession>;
  createManyUserInvite?: Maybe<Array<Maybe<UserInvite>>>;
  createProject?: Maybe<Project>;
  createStripeSetupIntent?: Maybe<StripeSetupIntent>;
  deleteProject?: Maybe<Project>;
  deleteStripePaymentMethod?: Maybe<StripePaymentMethod>;
  deleteTaxId?: Maybe<Ok>;
  deleteUserInvite?: Maybe<UserInvite>;
  deleteUserProject?: Maybe<UserProject>;
  purchasePriceItems?: Maybe<Scalars['Boolean']>;
  replacePrimaryPaymentMethod?: Maybe<StripePaymentMethod>;
  sendVerificationEmail?: Maybe<StatusResponse>;
  syncProjectStripe?: Maybe<Ok>;
  updateProject?: Maybe<Project>;
  updateStripePaymentMethod?: Maybe<StripePaymentMethod>;
  updateTaxId?: Maybe<Ok>;
  updateUser?: Maybe<User>;
  updateUserProject?: Maybe<UserProject>;
  upsertStripeSubscription?: Maybe<StripeSubscription>;
  userSignup?: Maybe<User>;
  verifyEmail?: Maybe<User>;
};


export type MutationCancelSubscriptionDowngradeArgs = {
  projectId: Scalars['String'];
};


export type MutationCreateCheckoutSessionArgs = {
  metadata?: Maybe<Scalars['Json']>;
  price: Scalars['String'];
  projectId: Scalars['String'];
  quantity?: Maybe<Scalars['Int']>;
};


export type MutationCreateManyUserInviteArgs = {
  input: CreateUserInviteInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateStripeSetupIntentArgs = {
  projectId: Scalars['String'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['String'];
};


export type MutationDeleteStripePaymentMethodArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTaxIdArgs = {
  projectId: Scalars['String'];
};


export type MutationDeleteUserInviteArgs = {
  id: Scalars['String'];
};


export type MutationDeleteUserProjectArgs = {
  id: Scalars['String'];
};


export type MutationPurchasePriceItemsArgs = {
  priceItems: Array<PurchasePriceItemsItemInput>;
  projectId: Scalars['String'];
};


export type MutationReplacePrimaryPaymentMethodArgs = {
  id: Scalars['String'];
};


export type MutationSyncProjectStripeArgs = {
  projectId: Scalars['String'];
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationUpdateStripePaymentMethodArgs = {
  input: UpdateStripePaymentMethodInput;
};


export type MutationUpdateTaxIdArgs = {
  input: UpdateTaxIdInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserProjectArgs = {
  input: UpdateUserProjectInput;
};


export type MutationUpsertStripeSubscriptionArgs = {
  input: UpsertStripeSubscriptionInput;
};


export type MutationUserSignupArgs = {
  input: UserSignupInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type Ok = {
  __typename?: 'Ok';
  message?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['String'];
  name: Scalars['String'];
  purchasedProducts: Array<PurchasedProduct>;
  stripeInvoices: Array<StripeInvoice>;
  stripePaymentMethods: Array<StripePaymentMethod>;
  stripeSubscriptions: Array<StripeSubscription>;
  userInvites: Array<UserInvite>;
  users: Array<UserProject>;
};


export type ProjectPurchasedProductsArgs = {
  cursor?: Maybe<PurchasedProductWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type ProjectStripeInvoicesArgs = {
  cursor?: Maybe<StripeInvoiceWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type ProjectStripePaymentMethodsArgs = {
  cursor?: Maybe<StripePaymentMethodWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type ProjectStripeSubscriptionsArgs = {
  cursor?: Maybe<StripeSubscriptionWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type ProjectUserInvitesArgs = {
  cursor?: Maybe<UserInviteWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type ProjectUsersArgs = {
  cursor?: Maybe<UserProjectWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export enum ProjectRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type PurchasePriceItemsItemInput = {
  priceId: Scalars['String'];
  quantity?: Maybe<Scalars['Int']>;
};

export type PurchasedProduct = {
  __typename?: 'PurchasedProduct';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  quantity: Scalars['Int'];
  stripeInvoice: StripeInvoice;
  stripePrice: StripePrice;
  stripeProduct: StripeProduct;
};

export type PurchasedProductWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  stripeInvoiceLineId?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getUserInvites?: Maybe<Array<Maybe<UserInvite>>>;
  ping: Scalars['String'];
  project?: Maybe<Project>;
  self?: Maybe<User>;
  stripeProducts?: Maybe<Array<Maybe<StripeProduct>>>;
};


export type QueryGetUserInvitesArgs = {
  projectId: Scalars['String'];
};


export type QueryProjectArgs = {
  projectId?: Maybe<Scalars['String']>;
};

export type StatusResponse = {
  __typename?: 'StatusResponse';
  message?: Maybe<Scalars['String']>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type StripeInvoice = {
  __typename?: 'StripeInvoice';
  amountDue: Scalars['Int'];
  amountPaid: Scalars['Int'];
  amountRemaining: Scalars['Int'];
  billingReason?: Maybe<InvoiceBillingReason>;
  created: Scalars['DateTime'];
  dueDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  invoicePdf?: Maybe<Scalars['String']>;
  periodEnd: Scalars['DateTime'];
  periodStart: Scalars['DateTime'];
  receiptNumber?: Maybe<Scalars['String']>;
  status?: Maybe<InvoiceStatus>;
  subtotal: Scalars['Int'];
  tax?: Maybe<Scalars['Int']>;
  total: Scalars['Int'];
};

export type StripeInvoiceWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
};

export type StripePaymentMethod = {
  __typename?: 'StripePaymentMethod';
  brand: Scalars['String'];
  createdAt: Scalars['DateTime'];
  expMonth: Scalars['Int'];
  expYear: Scalars['Int'];
  id: Scalars['String'];
  isDefault: Scalars['Boolean'];
  last4: Scalars['String'];
  project: Project;
  type: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type StripePaymentMethodWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
};

export type StripePrice = {
  __typename?: 'StripePrice';
  active: Scalars['Boolean'];
  currency: Scalars['String'];
  id: Scalars['String'];
  interval?: Maybe<Scalars['String']>;
  intervalCount?: Maybe<Scalars['Int']>;
  metadata: Scalars['Json'];
  stripeProduct?: Maybe<StripeProduct>;
  trialPeriodDays?: Maybe<Scalars['Int']>;
  type: StripePriceType;
  unitAmount?: Maybe<Scalars['Int']>;
};

export enum StripePriceType {
  OneTime = 'ONE_TIME',
  Recurring = 'RECURRING'
}

export type StripePriceWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
};

export type StripeProduct = {
  __typename?: 'StripeProduct';
  active: Scalars['Boolean'];
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  metadata: Scalars['Json'];
  name: Scalars['String'];
  stripePrices: Array<StripePrice>;
};


export type StripeProductStripePricesArgs = {
  cursor?: Maybe<StripePriceWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export type StripeSetupIntent = {
  __typename?: 'StripeSetupIntent';
  clientSecret: Scalars['String'];
};

export type StripeSubscription = {
  __typename?: 'StripeSubscription';
  cancelAt?: Maybe<Scalars['DateTime']>;
  cancelAtPeriodEnd: Scalars['Boolean'];
  canceledAt?: Maybe<Scalars['DateTime']>;
  created: Scalars['DateTime'];
  currentPeriodEnd: Scalars['DateTime'];
  currentPeriodStart: Scalars['DateTime'];
  endedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  metadata: Scalars['Json'];
  quantity: Scalars['Int'];
  status: StripeSubscriptionStatus;
  stripePrice: StripePrice;
  stripePriceId: Scalars['String'];
  upcomingQuantity?: Maybe<Scalars['Int']>;
  upcomingStartDate?: Maybe<Scalars['DateTime']>;
  upcomingStripePrice?: Maybe<StripePrice>;
  upcomingStripePriceId?: Maybe<Scalars['String']>;
};

export enum StripeSubscriptionStatus {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Incomplete = 'INCOMPLETE',
  IncompleteExpired = 'INCOMPLETE_EXPIRED',
  PastDue = 'PAST_DUE',
  Trialing = 'TRIALING',
  Unpaid = 'UNPAID'
}

export type StripeSubscriptionWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  ping?: Maybe<Scalars['DateTime']>;
};

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

export type UpdateProjectInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateStripePaymentMethodInput = {
  id: Scalars['String'];
  isDefault?: Maybe<Scalars['Boolean']>;
};

export type UpdateTaxIdInput = {
  projectId: Scalars['String'];
  taxId: Scalars['String'];
  taxType: TaxType;
};

export type UpdateUserInput = {
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateUserProjectInput = {
  id: Scalars['String'];
  role?: Maybe<ProjectRole>;
};

export type UpsertStripeSubscriptionInput = {
  priceId: Scalars['String'];
  projectId: Scalars['String'];
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
  cursor?: Maybe<UserProjectWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export type UserInvite = {
  __typename?: 'UserInvite';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['String'];
  role: ProjectRole;
};

export type UserInviteProjectIdEmailCompoundUniqueInput = {
  email: Scalars['String'];
  projectId: Scalars['String'];
};

export type UserInviteWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  projectId_email?: Maybe<UserInviteProjectIdEmailCompoundUniqueInput>;
  token?: Maybe<Scalars['String']>;
};

export type UserProject = {
  __typename?: 'UserProject';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  project: Project;
  role: ProjectRole;
  user: User;
};

export type UserProjectProjectIdUserIdCompoundUniqueInput = {
  projectId: Scalars['String'];
  userId: Scalars['String'];
};

export type UserProjectWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  projectId_userId?: Maybe<UserProjectProjectIdUserIdCompoundUniqueInput>;
};

export type UserSignupInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type VerificationToken = {
  __typename?: 'VerificationToken';
  id: Scalars['String'];
};

export const BaseProjcetFragmentDoc = gql`
    fragment BaseProjcet on Project {
  id
  name
}
    `;
export const BasePurchasedProductFragmentDoc = gql`
    fragment BasePurchasedProduct on PurchasedProduct {
  id
  quantity
  stripeProduct {
    id
    metadata
  }
}
    `;
export const BaseSelfFragmentDoc = gql`
    fragment BaseSelf on User {
  id
  email
  emailVerified
  name
  image
}
    `;
export const BaseStripeInvoiceFragmentDoc = gql`
    fragment BaseStripeInvoice on StripeInvoice {
  id
  created
  dueDate
  status
  amountDue
  amountPaid
  amountRemaining
  billingReason
  invoicePdf
  periodStart
  periodEnd
  receiptNumber
  subtotal
  tax
  total
}
    `;
export const BaseStripePaymenthMethodFragmentDoc = gql`
    fragment BaseStripePaymenthMethod on StripePaymentMethod {
  id
  createdAt
  brand
  last4
  expMonth
  expYear
  type
  isDefault
  updatedAt
}
    `;
export const BaseStripeProductFragmentDoc = gql`
    fragment BaseStripeProduct on StripeProduct {
  id
  name
  image
  metadata
}
    `;
export const BaseStripePriceFragmentDoc = gql`
    fragment BaseStripePrice on StripePrice {
  id
  interval
  intervalCount
  metadata
  unitAmount
  currency
  stripeProduct {
    ...BaseStripeProduct
  }
}
    ${BaseStripeProductFragmentDoc}`;
export const BaseStripeSubscriptionFragmentDoc = gql`
    fragment BaseStripeSubscription on StripeSubscription {
  id
  created
  metadata
  status
  quantity
  metadata
  cancelAt
  cancelAtPeriodEnd
  canceledAt
  currentPeriodEnd
  currentPeriodStart
  endedAt
  stripePrice {
    ...BaseStripePrice
  }
  upcomingQuantity
  upcomingStartDate
  upcomingStripePrice {
    ...BaseStripePrice
  }
}
    ${BaseStripePriceFragmentDoc}`;
export const CancelSubscriptionDowngradeDocument = gql`
    mutation CancelSubscriptionDowngrade($projectId: String!) {
  cancelSubscriptionDowngrade(projectId: $projectId) {
    ...BaseStripeSubscription
  }
}
    ${BaseStripeSubscriptionFragmentDoc}`;
export type CancelSubscriptionDowngradeMutationFn = Apollo.MutationFunction<CancelSubscriptionDowngradeMutation, CancelSubscriptionDowngradeMutationVariables>;

/**
 * __useCancelSubscriptionDowngradeMutation__
 *
 * To run a mutation, you first call `useCancelSubscriptionDowngradeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelSubscriptionDowngradeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelSubscriptionDowngradeMutation, { data, loading, error }] = useCancelSubscriptionDowngradeMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useCancelSubscriptionDowngradeMutation(baseOptions?: Apollo.MutationHookOptions<CancelSubscriptionDowngradeMutation, CancelSubscriptionDowngradeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelSubscriptionDowngradeMutation, CancelSubscriptionDowngradeMutationVariables>(CancelSubscriptionDowngradeDocument, options);
      }
export type CancelSubscriptionDowngradeMutationHookResult = ReturnType<typeof useCancelSubscriptionDowngradeMutation>;
export type CancelSubscriptionDowngradeMutationResult = Apollo.MutationResult<CancelSubscriptionDowngradeMutation>;
export type CancelSubscriptionDowngradeMutationOptions = Apollo.BaseMutationOptions<CancelSubscriptionDowngradeMutation, CancelSubscriptionDowngradeMutationVariables>;
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
export const CreateStripeSetupIntentDocument = gql`
    mutation CreateStripeSetupIntent($projectId: String!) {
  createStripeSetupIntent(projectId: $projectId) {
    clientSecret
  }
}
    `;
export type CreateStripeSetupIntentMutationFn = Apollo.MutationFunction<CreateStripeSetupIntentMutation, CreateStripeSetupIntentMutationVariables>;

/**
 * __useCreateStripeSetupIntentMutation__
 *
 * To run a mutation, you first call `useCreateStripeSetupIntentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStripeSetupIntentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStripeSetupIntentMutation, { data, loading, error }] = useCreateStripeSetupIntentMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useCreateStripeSetupIntentMutation(baseOptions?: Apollo.MutationHookOptions<CreateStripeSetupIntentMutation, CreateStripeSetupIntentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStripeSetupIntentMutation, CreateStripeSetupIntentMutationVariables>(CreateStripeSetupIntentDocument, options);
      }
export type CreateStripeSetupIntentMutationHookResult = ReturnType<typeof useCreateStripeSetupIntentMutation>;
export type CreateStripeSetupIntentMutationResult = Apollo.MutationResult<CreateStripeSetupIntentMutation>;
export type CreateStripeSetupIntentMutationOptions = Apollo.BaseMutationOptions<CreateStripeSetupIntentMutation, CreateStripeSetupIntentMutationVariables>;
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
export const DeleteStripePaymentMethodDocument = gql`
    mutation DeleteStripePaymentMethod($id: String!) {
  deleteStripePaymentMethod(id: $id) {
    id
  }
}
    `;
export type DeleteStripePaymentMethodMutationFn = Apollo.MutationFunction<DeleteStripePaymentMethodMutation, DeleteStripePaymentMethodMutationVariables>;

/**
 * __useDeleteStripePaymentMethodMutation__
 *
 * To run a mutation, you first call `useDeleteStripePaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStripePaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStripePaymentMethodMutation, { data, loading, error }] = useDeleteStripePaymentMethodMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStripePaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStripePaymentMethodMutation, DeleteStripePaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStripePaymentMethodMutation, DeleteStripePaymentMethodMutationVariables>(DeleteStripePaymentMethodDocument, options);
      }
export type DeleteStripePaymentMethodMutationHookResult = ReturnType<typeof useDeleteStripePaymentMethodMutation>;
export type DeleteStripePaymentMethodMutationResult = Apollo.MutationResult<DeleteStripePaymentMethodMutation>;
export type DeleteStripePaymentMethodMutationOptions = Apollo.BaseMutationOptions<DeleteStripePaymentMethodMutation, DeleteStripePaymentMethodMutationVariables>;
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
export const GetPaymentMethodsDocument = gql`
    query GetPaymentMethods($projectId: String) {
  project(projectId: $projectId) {
    id
    stripePaymentMethods {
      ...BaseStripePaymenthMethod
    }
  }
}
    ${BaseStripePaymenthMethodFragmentDoc}`;

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
export const ProjectDocument = gql`
    query Project($projectId: String) {
  project(projectId: $projectId) {
    ...BaseProjcet
  }
}
    ${BaseProjcetFragmentDoc}`;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectQuery(baseOptions?: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const ProjectSettingsDocument = gql`
    query ProjectSettings($projectId: String) {
  project(projectId: $projectId) {
    ...BaseProjcet
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
    stripeSubscriptions {
      ...BaseStripeSubscription
    }
    stripePaymentMethods {
      ...BaseStripePaymenthMethod
    }
    stripeInvoices {
      ...BaseStripeInvoice
    }
    purchasedProducts {
      ...BasePurchasedProduct
    }
  }
}
    ${BaseProjcetFragmentDoc}
${BaseStripeSubscriptionFragmentDoc}
${BaseStripePaymenthMethodFragmentDoc}
${BaseStripeInvoiceFragmentDoc}
${BasePurchasedProductFragmentDoc}`;

/**
 * __useProjectSettingsQuery__
 *
 * To run a query within a React component, call `useProjectSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectSettingsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectSettingsQuery(baseOptions?: Apollo.QueryHookOptions<ProjectSettingsQuery, ProjectSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectSettingsQuery, ProjectSettingsQueryVariables>(ProjectSettingsDocument, options);
      }
export function useProjectSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectSettingsQuery, ProjectSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectSettingsQuery, ProjectSettingsQueryVariables>(ProjectSettingsDocument, options);
        }
export type ProjectSettingsQueryHookResult = ReturnType<typeof useProjectSettingsQuery>;
export type ProjectSettingsLazyQueryHookResult = ReturnType<typeof useProjectSettingsLazyQuery>;
export type ProjectSettingsQueryResult = Apollo.QueryResult<ProjectSettingsQuery, ProjectSettingsQueryVariables>;
export const ProjectSubscriptionsDocument = gql`
    query ProjectSubscriptions($projectId: String) {
  project(projectId: $projectId) {
    id
    stripeSubscriptions {
      ...BaseStripeSubscription
    }
  }
}
    ${BaseStripeSubscriptionFragmentDoc}`;

/**
 * __useProjectSubscriptionsQuery__
 *
 * To run a query within a React component, call `useProjectSubscriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectSubscriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectSubscriptionsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectSubscriptionsQuery(baseOptions?: Apollo.QueryHookOptions<ProjectSubscriptionsQuery, ProjectSubscriptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectSubscriptionsQuery, ProjectSubscriptionsQueryVariables>(ProjectSubscriptionsDocument, options);
      }
export function useProjectSubscriptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectSubscriptionsQuery, ProjectSubscriptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectSubscriptionsQuery, ProjectSubscriptionsQueryVariables>(ProjectSubscriptionsDocument, options);
        }
export type ProjectSubscriptionsQueryHookResult = ReturnType<typeof useProjectSubscriptionsQuery>;
export type ProjectSubscriptionsLazyQueryHookResult = ReturnType<typeof useProjectSubscriptionsLazyQuery>;
export type ProjectSubscriptionsQueryResult = Apollo.QueryResult<ProjectSubscriptionsQuery, ProjectSubscriptionsQueryVariables>;
export const PurchasePriceItemsDocument = gql`
    mutation PurchasePriceItems($projectId: String!, $priceItems: [PurchasePriceItemsItemInput!]!) {
  purchasePriceItems(projectId: $projectId, priceItems: $priceItems)
}
    `;
export type PurchasePriceItemsMutationFn = Apollo.MutationFunction<PurchasePriceItemsMutation, PurchasePriceItemsMutationVariables>;

/**
 * __usePurchasePriceItemsMutation__
 *
 * To run a mutation, you first call `usePurchasePriceItemsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePurchasePriceItemsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [purchasePriceItemsMutation, { data, loading, error }] = usePurchasePriceItemsMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      priceItems: // value for 'priceItems'
 *   },
 * });
 */
export function usePurchasePriceItemsMutation(baseOptions?: Apollo.MutationHookOptions<PurchasePriceItemsMutation, PurchasePriceItemsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PurchasePriceItemsMutation, PurchasePriceItemsMutationVariables>(PurchasePriceItemsDocument, options);
      }
export type PurchasePriceItemsMutationHookResult = ReturnType<typeof usePurchasePriceItemsMutation>;
export type PurchasePriceItemsMutationResult = Apollo.MutationResult<PurchasePriceItemsMutation>;
export type PurchasePriceItemsMutationOptions = Apollo.BaseMutationOptions<PurchasePriceItemsMutation, PurchasePriceItemsMutationVariables>;
export const ReplacePrimaryPaymentMethodDocument = gql`
    mutation ReplacePrimaryPaymentMethod($id: String!) {
  replacePrimaryPaymentMethod(id: $id) {
    id
    updatedAt
    isDefault
  }
}
    `;
export type ReplacePrimaryPaymentMethodMutationFn = Apollo.MutationFunction<ReplacePrimaryPaymentMethodMutation, ReplacePrimaryPaymentMethodMutationVariables>;

/**
 * __useReplacePrimaryPaymentMethodMutation__
 *
 * To run a mutation, you first call `useReplacePrimaryPaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReplacePrimaryPaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [replacePrimaryPaymentMethodMutation, { data, loading, error }] = useReplacePrimaryPaymentMethodMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReplacePrimaryPaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<ReplacePrimaryPaymentMethodMutation, ReplacePrimaryPaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReplacePrimaryPaymentMethodMutation, ReplacePrimaryPaymentMethodMutationVariables>(ReplacePrimaryPaymentMethodDocument, options);
      }
export type ReplacePrimaryPaymentMethodMutationHookResult = ReturnType<typeof useReplacePrimaryPaymentMethodMutation>;
export type ReplacePrimaryPaymentMethodMutationResult = Apollo.MutationResult<ReplacePrimaryPaymentMethodMutation>;
export type ReplacePrimaryPaymentMethodMutationOptions = Apollo.BaseMutationOptions<ReplacePrimaryPaymentMethodMutation, ReplacePrimaryPaymentMethodMutationVariables>;
export const SelfProjectsDocument = gql`
    query SelfProjects {
  self {
    ...BaseSelf
    projects {
      id
      project {
        ...BaseProjcet
      }
    }
  }
}
    ${BaseSelfFragmentDoc}
${BaseProjcetFragmentDoc}`;

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
    ...BaseSelf
  }
}
    ${BaseSelfFragmentDoc}`;

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
export const SendVerificationEmailDocument = gql`
    mutation SendVerificationEmail {
  sendVerificationEmail {
    ok
  }
}
    `;
export type SendVerificationEmailMutationFn = Apollo.MutationFunction<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;

/**
 * __useSendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useSendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendVerificationEmailMutation, { data, loading, error }] = useSendVerificationEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useSendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>(SendVerificationEmailDocument, options);
      }
export type SendVerificationEmailMutationHookResult = ReturnType<typeof useSendVerificationEmailMutation>;
export type SendVerificationEmailMutationResult = Apollo.MutationResult<SendVerificationEmailMutation>;
export type SendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;
export const SyncProjectStripeDocument = gql`
    mutation SyncProjectStripe($projectId: String!) {
  syncProjectStripe(projectId: $projectId) {
    ok
    message
  }
}
    `;
export type SyncProjectStripeMutationFn = Apollo.MutationFunction<SyncProjectStripeMutation, SyncProjectStripeMutationVariables>;

/**
 * __useSyncProjectStripeMutation__
 *
 * To run a mutation, you first call `useSyncProjectStripeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncProjectStripeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncProjectStripeMutation, { data, loading, error }] = useSyncProjectStripeMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useSyncProjectStripeMutation(baseOptions?: Apollo.MutationHookOptions<SyncProjectStripeMutation, SyncProjectStripeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncProjectStripeMutation, SyncProjectStripeMutationVariables>(SyncProjectStripeDocument, options);
      }
export type SyncProjectStripeMutationHookResult = ReturnType<typeof useSyncProjectStripeMutation>;
export type SyncProjectStripeMutationResult = Apollo.MutationResult<SyncProjectStripeMutation>;
export type SyncProjectStripeMutationOptions = Apollo.BaseMutationOptions<SyncProjectStripeMutation, SyncProjectStripeMutationVariables>;
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
export const UpdateStripePaymentMethodDocument = gql`
    mutation UpdateStripePaymentMethod($input: UpdateStripePaymentMethodInput!) {
  updateStripePaymentMethod(input: $input) {
    id
    updatedAt
    isDefault
  }
}
    `;
export type UpdateStripePaymentMethodMutationFn = Apollo.MutationFunction<UpdateStripePaymentMethodMutation, UpdateStripePaymentMethodMutationVariables>;

/**
 * __useUpdateStripePaymentMethodMutation__
 *
 * To run a mutation, you first call `useUpdateStripePaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStripePaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStripePaymentMethodMutation, { data, loading, error }] = useUpdateStripePaymentMethodMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStripePaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStripePaymentMethodMutation, UpdateStripePaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStripePaymentMethodMutation, UpdateStripePaymentMethodMutationVariables>(UpdateStripePaymentMethodDocument, options);
      }
export type UpdateStripePaymentMethodMutationHookResult = ReturnType<typeof useUpdateStripePaymentMethodMutation>;
export type UpdateStripePaymentMethodMutationResult = Apollo.MutationResult<UpdateStripePaymentMethodMutation>;
export type UpdateStripePaymentMethodMutationOptions = Apollo.BaseMutationOptions<UpdateStripePaymentMethodMutation, UpdateStripePaymentMethodMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    name
    email
    emailVerified
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
export const UpsertStripeSubscriptionDocument = gql`
    mutation UpsertStripeSubscription($input: UpsertStripeSubscriptionInput!) {
  upsertStripeSubscription(input: $input) {
    id
    metadata
    status
    stripePriceId
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
export type UpsertStripeSubscriptionMutationFn = Apollo.MutationFunction<UpsertStripeSubscriptionMutation, UpsertStripeSubscriptionMutationVariables>;

/**
 * __useUpsertStripeSubscriptionMutation__
 *
 * To run a mutation, you first call `useUpsertStripeSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertStripeSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertStripeSubscriptionMutation, { data, loading, error }] = useUpsertStripeSubscriptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpsertStripeSubscriptionMutation(baseOptions?: Apollo.MutationHookOptions<UpsertStripeSubscriptionMutation, UpsertStripeSubscriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertStripeSubscriptionMutation, UpsertStripeSubscriptionMutationVariables>(UpsertStripeSubscriptionDocument, options);
      }
export type UpsertStripeSubscriptionMutationHookResult = ReturnType<typeof useUpsertStripeSubscriptionMutation>;
export type UpsertStripeSubscriptionMutationResult = Apollo.MutationResult<UpsertStripeSubscriptionMutation>;
export type UpsertStripeSubscriptionMutationOptions = Apollo.BaseMutationOptions<UpsertStripeSubscriptionMutation, UpsertStripeSubscriptionMutationVariables>;
export const UserSignupDocument = gql`
    mutation UserSignup($input: UserSignupInput!) {
  userSignup(input: $input) {
    ...BaseSelf
  }
}
    ${BaseSelfFragmentDoc}`;
export type UserSignupMutationFn = Apollo.MutationFunction<UserSignupMutation, UserSignupMutationVariables>;

/**
 * __useUserSignupMutation__
 *
 * To run a mutation, you first call `useUserSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userSignupMutation, { data, loading, error }] = useUserSignupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserSignupMutation(baseOptions?: Apollo.MutationHookOptions<UserSignupMutation, UserSignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserSignupMutation, UserSignupMutationVariables>(UserSignupDocument, options);
      }
export type UserSignupMutationHookResult = ReturnType<typeof useUserSignupMutation>;
export type UserSignupMutationResult = Apollo.MutationResult<UserSignupMutation>;
export type UserSignupMutationOptions = Apollo.BaseMutationOptions<UserSignupMutation, UserSignupMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    ...BaseSelf
  }
}
    ${BaseSelfFragmentDoc}`;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export type BaseProjcetFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'name'>
);

export type BasePurchasedProductFragment = (
  { __typename?: 'PurchasedProduct' }
  & Pick<PurchasedProduct, 'id' | 'quantity'>
  & { stripeProduct: (
    { __typename?: 'StripeProduct' }
    & Pick<StripeProduct, 'id' | 'metadata'>
  ) }
);

export type BaseSelfFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'emailVerified' | 'name' | 'image'>
);

export type BaseStripeInvoiceFragment = (
  { __typename?: 'StripeInvoice' }
  & Pick<StripeInvoice, 'id' | 'created' | 'dueDate' | 'status' | 'amountDue' | 'amountPaid' | 'amountRemaining' | 'billingReason' | 'invoicePdf' | 'periodStart' | 'periodEnd' | 'receiptNumber' | 'subtotal' | 'tax' | 'total'>
);

export type BaseStripePaymenthMethodFragment = (
  { __typename?: 'StripePaymentMethod' }
  & Pick<StripePaymentMethod, 'id' | 'createdAt' | 'brand' | 'last4' | 'expMonth' | 'expYear' | 'type' | 'isDefault' | 'updatedAt'>
);

export type BaseStripePriceFragment = (
  { __typename?: 'StripePrice' }
  & Pick<StripePrice, 'id' | 'interval' | 'intervalCount' | 'metadata' | 'unitAmount' | 'currency'>
  & { stripeProduct?: Maybe<(
    { __typename?: 'StripeProduct' }
    & BaseStripeProductFragment
  )> }
);

export type BaseStripeProductFragment = (
  { __typename?: 'StripeProduct' }
  & Pick<StripeProduct, 'id' | 'name' | 'image' | 'metadata'>
);

export type BaseStripeSubscriptionFragment = (
  { __typename?: 'StripeSubscription' }
  & Pick<StripeSubscription, 'id' | 'created' | 'metadata' | 'status' | 'quantity' | 'cancelAt' | 'cancelAtPeriodEnd' | 'canceledAt' | 'currentPeriodEnd' | 'currentPeriodStart' | 'endedAt' | 'upcomingQuantity' | 'upcomingStartDate'>
  & { stripePrice: (
    { __typename?: 'StripePrice' }
    & BaseStripePriceFragment
  ), upcomingStripePrice?: Maybe<(
    { __typename?: 'StripePrice' }
    & BaseStripePriceFragment
  )> }
);

export type CancelSubscriptionDowngradeMutationVariables = Exact<{
  projectId: Scalars['String'];
}>;


export type CancelSubscriptionDowngradeMutation = (
  { __typename?: 'Mutation' }
  & { cancelSubscriptionDowngrade?: Maybe<(
    { __typename?: 'StripeSubscription' }
    & BaseStripeSubscriptionFragment
  )> }
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

export type CreateStripeSetupIntentMutationVariables = Exact<{
  projectId: Scalars['String'];
}>;


export type CreateStripeSetupIntentMutation = (
  { __typename?: 'Mutation' }
  & { createStripeSetupIntent?: Maybe<(
    { __typename?: 'StripeSetupIntent' }
    & Pick<StripeSetupIntent, 'clientSecret'>
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

export type DeleteStripePaymentMethodMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteStripePaymentMethodMutation = (
  { __typename?: 'Mutation' }
  & { deleteStripePaymentMethod?: Maybe<(
    { __typename?: 'StripePaymentMethod' }
    & Pick<StripePaymentMethod, 'id'>
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

export type GetPaymentMethodsQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type GetPaymentMethodsQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { stripePaymentMethods: Array<(
      { __typename?: 'StripePaymentMethod' }
      & BaseStripePaymenthMethodFragment
    )> }
  )> }
);

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'ping'>
);

export type ProjectQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & BaseProjcetFragment
  )> }
);

export type ProjectSettingsQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type ProjectSettingsQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
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
    )>, stripeSubscriptions: Array<(
      { __typename?: 'StripeSubscription' }
      & BaseStripeSubscriptionFragment
    )>, stripePaymentMethods: Array<(
      { __typename?: 'StripePaymentMethod' }
      & BaseStripePaymenthMethodFragment
    )>, stripeInvoices: Array<(
      { __typename?: 'StripeInvoice' }
      & BaseStripeInvoiceFragment
    )>, purchasedProducts: Array<(
      { __typename?: 'PurchasedProduct' }
      & BasePurchasedProductFragment
    )> }
    & BaseProjcetFragment
  )> }
);

export type ProjectSubscriptionsQueryVariables = Exact<{
  projectId?: Maybe<Scalars['String']>;
}>;


export type ProjectSubscriptionsQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { stripeSubscriptions: Array<(
      { __typename?: 'StripeSubscription' }
      & BaseStripeSubscriptionFragment
    )> }
  )> }
);

export type PurchasePriceItemsMutationVariables = Exact<{
  projectId: Scalars['String'];
  priceItems: Array<PurchasePriceItemsItemInput> | PurchasePriceItemsItemInput;
}>;


export type PurchasePriceItemsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'purchasePriceItems'>
);

export type ReplacePrimaryPaymentMethodMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ReplacePrimaryPaymentMethodMutation = (
  { __typename?: 'Mutation' }
  & { replacePrimaryPaymentMethod?: Maybe<(
    { __typename?: 'StripePaymentMethod' }
    & Pick<StripePaymentMethod, 'id' | 'updatedAt' | 'isDefault'>
  )> }
);

export type SelfProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfProjectsQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & { projects: Array<(
      { __typename?: 'UserProject' }
      & Pick<UserProject, 'id'>
      & { project: (
        { __typename?: 'Project' }
        & BaseProjcetFragment
      ) }
    )> }
    & BaseSelfFragment
  )> }
);

export type SelfQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & BaseSelfFragment
  )> }
);

export type SendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type SendVerificationEmailMutation = (
  { __typename?: 'Mutation' }
  & { sendVerificationEmail?: Maybe<(
    { __typename?: 'StatusResponse' }
    & Pick<StatusResponse, 'ok'>
  )> }
);

export type SyncProjectStripeMutationVariables = Exact<{
  projectId: Scalars['String'];
}>;


export type SyncProjectStripeMutation = (
  { __typename?: 'Mutation' }
  & { syncProjectStripe?: Maybe<(
    { __typename?: 'Ok' }
    & Pick<Ok, 'ok' | 'message'>
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

export type UpdateStripePaymentMethodMutationVariables = Exact<{
  input: UpdateStripePaymentMethodInput;
}>;


export type UpdateStripePaymentMethodMutation = (
  { __typename?: 'Mutation' }
  & { updateStripePaymentMethod?: Maybe<(
    { __typename?: 'StripePaymentMethod' }
    & Pick<StripePaymentMethod, 'id' | 'updatedAt' | 'isDefault'>
  )> }
);

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email' | 'emailVerified'>
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

export type UpsertStripeSubscriptionMutationVariables = Exact<{
  input: UpsertStripeSubscriptionInput;
}>;


export type UpsertStripeSubscriptionMutation = (
  { __typename?: 'Mutation' }
  & { upsertStripeSubscription?: Maybe<(
    { __typename?: 'StripeSubscription' }
    & Pick<StripeSubscription, 'id' | 'metadata' | 'status' | 'stripePriceId' | 'quantity' | 'cancelAtPeriodEnd' | 'cancelAt' | 'canceledAt' | 'currentPeriodStart' | 'currentPeriodEnd' | 'created' | 'endedAt'>
  )> }
);

export type UserSignupMutationVariables = Exact<{
  input: UserSignupInput;
}>;


export type UserSignupMutation = (
  { __typename?: 'Mutation' }
  & { userSignup?: Maybe<(
    { __typename?: 'User' }
    & BaseSelfFragment
  )> }
);

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & { verifyEmail?: Maybe<(
    { __typename?: 'User' }
    & BaseSelfFragment
  )> }
);
