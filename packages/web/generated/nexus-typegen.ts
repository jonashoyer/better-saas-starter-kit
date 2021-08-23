/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as prisma from "./../../../node_modules/.prisma/client/index"
import type { Context } from "./../graphql/context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    Json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Json";
    Date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    Json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Json";
    Date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CreateProjectInput: { // input type
    name: string; // String!
  }
  CreateUserInviteInput: { // input type
    emails: string[]; // [String!]!
    projectId: string; // String!
    role: NexusGenEnums['ProjectRole']; // ProjectRole!
  }
  PaymentMethodWhereUniqueInput: { // input type
    id?: string | null; // String
    stripePaymentMethodId?: string | null; // String
  }
  UpdateProjectInput: { // input type
    id: string; // String!
    name?: string | null; // String
  }
  UpdateUserInput: { // input type
    id: string; // String!
    name?: string | null; // String
  }
  UpdateUserProjectInput: { // input type
    id: string; // String!
    role?: NexusGenEnums['ProjectRole'] | null; // ProjectRole
  }
  UserInviteProjectIdEmailCompoundUniqueInput: { // input type
    email: string; // String!
    projectId: string; // String!
  }
  UserInviteWhereUniqueInput: { // input type
    id?: string | null; // String
    projectId_email?: NexusGenInputs['UserInviteProjectIdEmailCompoundUniqueInput'] | null; // UserInviteProjectIdEmailCompoundUniqueInput
    token?: string | null; // String
  }
  UserProjectProjectIdUserIdCompoundUniqueInput: { // input type
    projectId: string; // String!
    userId: string; // String!
  }
  UserProjectWhereUniqueInput: { // input type
    id?: string | null; // String
    projectId_userId?: NexusGenInputs['UserProjectProjectIdUserIdCompoundUniqueInput'] | null; // UserProjectProjectIdUserIdCompoundUniqueInput
  }
}

export interface NexusGenEnums {
  InvoiceBillingReason: prisma.InvoiceBillingReason
  InvoiceStatus: prisma.InvoiceStatus
  PaymentMethodImportance: prisma.PaymentMethodImportance
  ProjectRole: prisma.ProjectRole
  SubscriptionPlan: prisma.SubscriptionPlan
  SubscriptionStatus: "ACTIVE" | "CANCELED" | "INCOMPLETE" | "INCOMPLETE_EXPIRED" | "PAST_DUE" | "TRIALING" | "UNPAID"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: any
  DateTime: any
  JSONObject: any
  Json: any
}

export interface NexusGenObjects {
  BillingInfomation: { // root type
    currentPrice: string; // String!
    currentQuantity: number; // Int!
    latestInvoice: NexusGenRootTypes['Invoice']; // Invoice!
    upcomingInvoice: NexusGenRootTypes['Invoice']; // Invoice!
  }
  CheckoutSession: { // root type
    sessionId?: string | null; // String
  }
  Invoice: prisma.Invoice;
  Mutation: {};
  PaymentMethod: prisma.PaymentMethod;
  Project: prisma.Project;
  Query: {};
  SetupIntent: { // root type
    clientSecret: string; // String!
  }
  StatusResponse: { // root type
    message?: string | null; // String
    ok?: boolean | null; // Boolean
  }
  Subscription: { // root type
    status: NexusGenEnums['SubscriptionStatus']; // SubscriptionStatus!
    stripeSubscriptionId: string; // String!
    trialEnd?: NexusGenScalars['Date'] | null; // Date
  }
  User: prisma.User;
  UserInvite: prisma.UserInvite;
  UserProject: prisma.UserProject;
  VerificationEmail: prisma.VerificationEmail;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  BillingInfomation: { // field return type
    currentPrice: string; // String!
    currentQuantity: number; // Int!
    latestInvoice: NexusGenRootTypes['Invoice']; // Invoice!
    upcomingInvoice: NexusGenRootTypes['Invoice']; // Invoice!
  }
  CheckoutSession: { // field return type
    sessionId: string | null; // String
  }
  Invoice: { // field return type
    amountDue: number; // Int!
    amountPaid: number; // Int!
    amountRemaining: number; // Int!
    billingReason: NexusGenEnums['InvoiceBillingReason'] | null; // InvoiceBillingReason
    created: NexusGenScalars['DateTime']; // DateTime!
    dueDate: NexusGenScalars['DateTime'] | null; // DateTime
    id: string; // String!
    invoicePdf: string | null; // String
    periodEnd: NexusGenScalars['DateTime']; // DateTime!
    periodStart: NexusGenScalars['DateTime']; // DateTime!
    receiptNumber: string | null; // String
    status: NexusGenEnums['InvoiceStatus']; // InvoiceStatus!
    stripeInvoiceId: string; // String!
    subtotal: number; // Int!
    tax: number | null; // Int
    total: number; // Int!
  }
  Mutation: { // field return type
    createCheckoutSession: NexusGenRootTypes['CheckoutSession'] | null; // CheckoutSession
    createManyUserInvite: Array<NexusGenRootTypes['UserInvite'] | null> | null; // [UserInvite]
    createProject: NexusGenRootTypes['Project'] | null; // Project
    createSetupIntent: NexusGenRootTypes['SetupIntent'] | null; // SetupIntent
    createSubscription: NexusGenRootTypes['Subscription'] | null; // Subscription
    deleteProject: NexusGenRootTypes['Project'] | null; // Project
    deleteUserInvite: NexusGenRootTypes['UserInvite'] | null; // UserInvite
    deleteUserProject: NexusGenRootTypes['UserProject'] | null; // UserProject
    sendVerifyEmail: NexusGenRootTypes['StatusResponse'] | null; // StatusResponse
    updateProject: NexusGenRootTypes['Project'] | null; // Project
    updateSubscription: NexusGenRootTypes['Subscription'] | null; // Subscription
    updateUser: NexusGenRootTypes['User'] | null; // User
    updateUserProject: NexusGenRootTypes['UserProject'] | null; // UserProject
    verifyEmail: NexusGenRootTypes['User'] | null; // User
  }
  PaymentMethod: { // field return type
    brand: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    expMonth: number; // Int!
    expYear: number; // Int!
    id: string; // String!
    importance: NexusGenEnums['PaymentMethodImportance']; // PaymentMethodImportance!
    last4: string; // String!
    project: NexusGenRootTypes['Project']; // Project!
    type: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Project: { // field return type
    id: string; // String!
    name: string; // String!
    paymentMethods: NexusGenRootTypes['PaymentMethod'][]; // [PaymentMethod!]!
    subscriptionPlan: NexusGenEnums['SubscriptionPlan']; // SubscriptionPlan!
    userInvites: NexusGenRootTypes['UserInvite'][]; // [UserInvite!]!
    users: NexusGenRootTypes['UserProject'][]; // [UserProject!]!
  }
  Query: { // field return type
    currentProject: NexusGenRootTypes['Project'] | null; // Project
    getBillingInfomation: NexusGenRootTypes['BillingInfomation'] | null; // BillingInfomation
    getUserInvites: Array<NexusGenRootTypes['UserInvite'] | null> | null; // [UserInvite]
    ping: string; // String!
    self: NexusGenRootTypes['User'] | null; // User
    selfProjects: Array<NexusGenRootTypes['Project'] | null> | null; // [Project]
  }
  SetupIntent: { // field return type
    clientSecret: string; // String!
  }
  StatusResponse: { // field return type
    message: string | null; // String
    ok: boolean | null; // Boolean
  }
  Subscription: { // field return type
    status: NexusGenEnums['SubscriptionStatus']; // SubscriptionStatus!
    stripeSubscriptionId: string; // String!
    trialEnd: NexusGenScalars['Date'] | null; // Date
  }
  User: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string | null; // String
    emailVerified: NexusGenScalars['DateTime'] | null; // DateTime
    id: string; // String!
    image: string | null; // String
    name: string | null; // String
    projects: NexusGenRootTypes['UserProject'][]; // [UserProject!]!
  }
  UserInvite: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    id: string; // String!
    role: NexusGenEnums['ProjectRole']; // ProjectRole!
  }
  UserProject: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    project: NexusGenRootTypes['Project']; // Project!
    role: NexusGenEnums['ProjectRole']; // ProjectRole!
    user: NexusGenRootTypes['User']; // User!
  }
  VerificationEmail: { // field return type
    id: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  BillingInfomation: { // field return type name
    currentPrice: 'String'
    currentQuantity: 'Int'
    latestInvoice: 'Invoice'
    upcomingInvoice: 'Invoice'
  }
  CheckoutSession: { // field return type name
    sessionId: 'String'
  }
  Invoice: { // field return type name
    amountDue: 'Int'
    amountPaid: 'Int'
    amountRemaining: 'Int'
    billingReason: 'InvoiceBillingReason'
    created: 'DateTime'
    dueDate: 'DateTime'
    id: 'String'
    invoicePdf: 'String'
    periodEnd: 'DateTime'
    periodStart: 'DateTime'
    receiptNumber: 'String'
    status: 'InvoiceStatus'
    stripeInvoiceId: 'String'
    subtotal: 'Int'
    tax: 'Int'
    total: 'Int'
  }
  Mutation: { // field return type name
    createCheckoutSession: 'CheckoutSession'
    createManyUserInvite: 'UserInvite'
    createProject: 'Project'
    createSetupIntent: 'SetupIntent'
    createSubscription: 'Subscription'
    deleteProject: 'Project'
    deleteUserInvite: 'UserInvite'
    deleteUserProject: 'UserProject'
    sendVerifyEmail: 'StatusResponse'
    updateProject: 'Project'
    updateSubscription: 'Subscription'
    updateUser: 'User'
    updateUserProject: 'UserProject'
    verifyEmail: 'User'
  }
  PaymentMethod: { // field return type name
    brand: 'String'
    createdAt: 'DateTime'
    expMonth: 'Int'
    expYear: 'Int'
    id: 'String'
    importance: 'PaymentMethodImportance'
    last4: 'String'
    project: 'Project'
    type: 'String'
    updatedAt: 'DateTime'
  }
  Project: { // field return type name
    id: 'String'
    name: 'String'
    paymentMethods: 'PaymentMethod'
    subscriptionPlan: 'SubscriptionPlan'
    userInvites: 'UserInvite'
    users: 'UserProject'
  }
  Query: { // field return type name
    currentProject: 'Project'
    getBillingInfomation: 'BillingInfomation'
    getUserInvites: 'UserInvite'
    ping: 'String'
    self: 'User'
    selfProjects: 'Project'
  }
  SetupIntent: { // field return type name
    clientSecret: 'String'
  }
  StatusResponse: { // field return type name
    message: 'String'
    ok: 'Boolean'
  }
  Subscription: { // field return type name
    status: 'SubscriptionStatus'
    stripeSubscriptionId: 'String'
    trialEnd: 'Date'
  }
  User: { // field return type name
    createdAt: 'DateTime'
    email: 'String'
    emailVerified: 'DateTime'
    id: 'String'
    image: 'String'
    name: 'String'
    projects: 'UserProject'
  }
  UserInvite: { // field return type name
    createdAt: 'DateTime'
    email: 'String'
    id: 'String'
    role: 'ProjectRole'
  }
  UserProject: { // field return type name
    createdAt: 'DateTime'
    id: 'String'
    project: 'Project'
    role: 'ProjectRole'
    user: 'User'
  }
  VerificationEmail: { // field return type name
    id: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createCheckoutSession: { // args
      metadata: NexusGenScalars['Json'] | null; // Json
      price: string; // String!
      projectId: string; // String!
      quantity: number | null; // Int
    }
    createManyUserInvite: { // args
      input: NexusGenInputs['CreateUserInviteInput']; // CreateUserInviteInput!
    }
    createProject: { // args
      input: NexusGenInputs['CreateProjectInput']; // CreateProjectInput!
    }
    createSetupIntent: { // args
      projectId: string; // String!
    }
    createSubscription: { // args
      priceId: string; // String!
      projectId: string; // String!
      quantity: number; // Int!
    }
    deleteProject: { // args
      id: string; // String!
    }
    deleteUserInvite: { // args
      id: string; // String!
    }
    deleteUserProject: { // args
      id: string; // String!
    }
    sendVerifyEmail: { // args
      email: string; // String!
    }
    updateProject: { // args
      input: NexusGenInputs['UpdateProjectInput']; // UpdateProjectInput!
    }
    updateSubscription: { // args
      priceId?: string | null; // String
      projectId: string; // String!
      quantity?: number | null; // Int
    }
    updateUser: { // args
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
    updateUserProject: { // args
      input: NexusGenInputs['UpdateUserProjectInput']; // UpdateUserProjectInput!
    }
    verifyEmail: { // args
      token: string; // String!
    }
  }
  Project: {
    paymentMethods: { // args
      cursor?: NexusGenInputs['PaymentMethodWhereUniqueInput'] | null; // PaymentMethodWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    userInvites: { // args
      cursor?: NexusGenInputs['UserInviteWhereUniqueInput'] | null; // UserInviteWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    users: { // args
      cursor?: NexusGenInputs['UserProjectWhereUniqueInput'] | null; // UserProjectWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
  }
  Query: {
    currentProject: { // args
      projectId?: string | null; // String
    }
    getBillingInfomation: { // args
      subscriptionId: string; // String!
    }
    getUserInvites: { // args
      projectId: string; // String!
    }
  }
  User: {
    projects: { // args
      cursor?: NexusGenInputs['UserProjectWhereUniqueInput'] | null; // UserProjectWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Whether the type can be null
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    nullable?: boolean
    /**
     * Whether the type is list of values, or just a single value.
     * If list is true, we assume the type is a list. If list is an array,
     * we'll assume that it's a list with the depth. The boolean indicates whether
     * the type is required (non-null), where true = nonNull, false = nullable.
     * @see declarativeWrappingPlugin
     */
    list?: true | boolean[]
    /**
     * Whether the type should be non null, `required: true` = `nullable: false`
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    required?: boolean
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
    /**
     * The nullability guard can be helpful, but is also a potentially expensive operation for lists.
     * We need to iterate the entire list to check for null items to guard against. Set this to true
     * to skip the null guard on a specific field if you know there's no potential for unsafe types.
     */
    skipNullGuard?: boolean
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Whether the type can be null
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    nullable?: boolean
    /**
     * Whether the type is list of values, or just a single value.
     * If list is true, we assume the type is a list. If list is an array,
     * we'll assume that it's a list with the depth. The boolean indicates whether
     * the type is required (non-null), where true = nonNull, false = nullable.
     * @see declarativeWrappingPlugin
     */
    list?: true | boolean[]
    /**
     * Whether the type should be non null, `required: true` = `nullable: false`
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    required?: boolean
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
    /**
     * Whether the type can be null
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    nullable?: boolean
    /**
     * Whether the type is list of values, or just a single value.
     * If list is true, we assume the type is a list. If list is an array,
     * we'll assume that it's a list with the depth. The boolean indicates whether
     * the type is required (non-null), where true = nonNull, false = nullable.
     * @see declarativeWrappingPlugin
     */
    list?: true | boolean[]
    /**
     * Whether the type should be non null, `required: true` = `nullable: false`
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    required?: boolean
  }
}