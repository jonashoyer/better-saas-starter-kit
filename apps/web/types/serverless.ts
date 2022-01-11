export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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





export type Mutation = {
  __typename?: 'Mutation';
  CreateCheckoutSession?: Maybe<CheckoutSession>;
};


export type MutationCreateCheckoutSessionArgs = {
  price: Scalars['String'];
  quantity?: Maybe<Scalars['Int']>;
  metadata?: Maybe<Scalars['Json']>;
  projectId: Scalars['String'];
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
  role: UserRole;
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

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'ping'>
);
