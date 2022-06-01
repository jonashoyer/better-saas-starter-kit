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
  StripeInvoiceWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  StripePaymentMethodWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  StripePriceWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  StripeSubscriptionWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  UpdateProjectInput: { // input type
    id: string; // String!
    name?: string | null; // String
  }
  UpdateStripePaymentMethodInput: { // input type
    id: string; // String!
    importance?: NexusGenEnums['PaymentMethodImportance'] | null; // PaymentMethodImportance
  }
  UpdateTaxIdInput: { // input type
    projectId: string; // String!
    taxId: string; // String!
    taxType: NexusGenEnums['TaxType']; // TaxType!
  }
  UpdateUserInput: { // input type
    id: string; // String!
    name?: string | null; // String
  }
  UpdateUserProjectInput: { // input type
    id: string; // String!
    role?: NexusGenEnums['ProjectRole'] | null; // ProjectRole
  }
  UpsertStripeSubscriptionInput: { // input type
    priceId: string; // String!
    projectId: string; // String!
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
  StripeSubscriptionStatus: prisma.StripeSubscriptionStatus
  TaxType: "AE_TRN" | "AU_ABN" | "AU_ARN" | "BR_CNPJ" | "BR_CPF" | "CA_BN" | "CA_GST_HST" | "CA_PST_BC" | "CA_PST_MB" | "CA_PST_SK" | "CA_QST" | "CH_VAT" | "CL_TIN" | "ES_CIF" | "EU_VAT" | "GB_VAT" | "HK_BR" | "ID_NPWP" | "IL_VAT" | "IN_GST" | "JP_CN" | "JP_RN" | "KR_BRN" | "LI_UID" | "MX_RFC" | "MY_FRP" | "MY_ITN" | "MY_SST" | "NO_VAT" | "NZ_GST" | "RU_INN" | "RU_KPP" | "SA_VAT" | "SG_GST" | "SG_UEN" | "TH_VAT" | "TW_VAT" | "US_EIN" | "ZA_VAT"
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
  CheckoutSession: { // root type
    sessionId?: string | null; // String
  }
  Mutation: {};
  Ok: { // root type
    message?: string | null; // String
    ok: boolean; // Boolean!
  }
  Project: prisma.Project;
  Query: {};
  StatusResponse: { // root type
    message?: string | null; // String
    ok?: boolean | null; // Boolean
  }
  StripeInvoice: prisma.StripeInvoice;
  StripePaymentMethod: prisma.StripePaymentMethod;
  StripePrice: prisma.StripePrice;
  StripeProduct: prisma.StripeProduct;
  StripeSetupIntent: { // root type
    clientSecret: string; // String!
  }
  StripeSubscription: prisma.StripeSubscription;
  User: prisma.User;
  UserInvite: prisma.UserInvite;
  UserProject: prisma.UserProject;
  VerificationToken: prisma.VerificationToken;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  CheckoutSession: { // field return type
    sessionId: string | null; // String
  }
  Mutation: { // field return type
    createCheckoutSession: NexusGenRootTypes['CheckoutSession'] | null; // CheckoutSession
    createManyUserInvite: Array<NexusGenRootTypes['UserInvite'] | null> | null; // [UserInvite]
    createProject: NexusGenRootTypes['Project'] | null; // Project
    createStripeSetupIntent: NexusGenRootTypes['StripeSetupIntent'] | null; // StripeSetupIntent
    deleteProject: NexusGenRootTypes['Project'] | null; // Project
    deleteStripePaymentMethod: NexusGenRootTypes['StripePaymentMethod'] | null; // StripePaymentMethod
    deleteTaxId: NexusGenRootTypes['Ok'] | null; // Ok
    deleteUserInvite: NexusGenRootTypes['UserInvite'] | null; // UserInvite
    deleteUserProject: NexusGenRootTypes['UserProject'] | null; // UserProject
    sendVerifyEmail: NexusGenRootTypes['StatusResponse'] | null; // StatusResponse
    updateProject: NexusGenRootTypes['Project'] | null; // Project
    updateStripePaymentMethod: NexusGenRootTypes['StripePaymentMethod'] | null; // StripePaymentMethod
    updateTaxId: NexusGenRootTypes['Ok'] | null; // Ok
    updateUser: NexusGenRootTypes['User'] | null; // User
    updateUserProject: NexusGenRootTypes['UserProject'] | null; // UserProject
    upsertStripeSubscription: NexusGenRootTypes['StripeSubscription'] | null; // StripeSubscription
    verifyEmail: NexusGenRootTypes['User'] | null; // User
  }
  Ok: { // field return type
    message: string | null; // String
    ok: boolean; // Boolean!
  }
  Project: { // field return type
    id: string; // String!
    name: string; // String!
    stripeInvoices: NexusGenRootTypes['StripeInvoice'][]; // [StripeInvoice!]!
    stripePaymentMethods: NexusGenRootTypes['StripePaymentMethod'][]; // [StripePaymentMethod!]!
    stripeSubscriptions: NexusGenRootTypes['StripeSubscription'][]; // [StripeSubscription!]!
    userInvites: NexusGenRootTypes['UserInvite'][]; // [UserInvite!]!
    users: NexusGenRootTypes['UserProject'][]; // [UserProject!]!
  }
  Query: { // field return type
    getUserInvites: Array<NexusGenRootTypes['UserInvite'] | null> | null; // [UserInvite]
    ping: string; // String!
    project: NexusGenRootTypes['Project'] | null; // Project
    self: NexusGenRootTypes['User'] | null; // User
    selfProjects: Array<NexusGenRootTypes['Project'] | null> | null; // [Project]
    stripeProducts: Array<NexusGenRootTypes['StripeProduct'] | null> | null; // [StripeProduct]
  }
  StatusResponse: { // field return type
    message: string | null; // String
    ok: boolean | null; // Boolean
  }
  StripeInvoice: { // field return type
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
    status: NexusGenEnums['InvoiceStatus'] | null; // InvoiceStatus
    subtotal: number; // Int!
    tax: number | null; // Int
    total: number; // Int!
  }
  StripePaymentMethod: { // field return type
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
  StripePrice: { // field return type
    active: boolean; // Boolean!
    currency: string; // String!
    id: string; // String!
    interval: string | null; // String
    intervalCount: number | null; // Int
    metadata: NexusGenScalars['Json']; // Json!
    stripeProduct: NexusGenRootTypes['StripeProduct'] | null; // StripeProduct
    trialPeriodDays: number | null; // Int
    unitAmount: number | null; // Int
  }
  StripeProduct: { // field return type
    active: boolean; // Boolean!
    id: string; // String!
    image: string | null; // String
    metadata: NexusGenScalars['Json']; // Json!
    name: string; // String!
    stripePrices: NexusGenRootTypes['StripePrice'][]; // [StripePrice!]!
  }
  StripeSetupIntent: { // field return type
    clientSecret: string; // String!
  }
  StripeSubscription: { // field return type
    cancelAt: NexusGenScalars['DateTime'] | null; // DateTime
    cancelAtPeriodEnd: boolean; // Boolean!
    canceledAt: NexusGenScalars['DateTime'] | null; // DateTime
    created: NexusGenScalars['DateTime']; // DateTime!
    currentPeriodEnd: NexusGenScalars['DateTime']; // DateTime!
    currentPeriodStart: NexusGenScalars['DateTime']; // DateTime!
    endedAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: string; // String!
    metadata: NexusGenScalars['Json']; // Json!
    quantity: number; // Int!
    status: NexusGenEnums['StripeSubscriptionStatus']; // StripeSubscriptionStatus!
    stripePrice: NexusGenRootTypes['StripePrice']; // StripePrice!
    stripePriceId: string; // String!
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
  VerificationToken: { // field return type
    id: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  CheckoutSession: { // field return type name
    sessionId: 'String'
  }
  Mutation: { // field return type name
    createCheckoutSession: 'CheckoutSession'
    createManyUserInvite: 'UserInvite'
    createProject: 'Project'
    createStripeSetupIntent: 'StripeSetupIntent'
    deleteProject: 'Project'
    deleteStripePaymentMethod: 'StripePaymentMethod'
    deleteTaxId: 'Ok'
    deleteUserInvite: 'UserInvite'
    deleteUserProject: 'UserProject'
    sendVerifyEmail: 'StatusResponse'
    updateProject: 'Project'
    updateStripePaymentMethod: 'StripePaymentMethod'
    updateTaxId: 'Ok'
    updateUser: 'User'
    updateUserProject: 'UserProject'
    upsertStripeSubscription: 'StripeSubscription'
    verifyEmail: 'User'
  }
  Ok: { // field return type name
    message: 'String'
    ok: 'Boolean'
  }
  Project: { // field return type name
    id: 'String'
    name: 'String'
    stripeInvoices: 'StripeInvoice'
    stripePaymentMethods: 'StripePaymentMethod'
    stripeSubscriptions: 'StripeSubscription'
    userInvites: 'UserInvite'
    users: 'UserProject'
  }
  Query: { // field return type name
    getUserInvites: 'UserInvite'
    ping: 'String'
    project: 'Project'
    self: 'User'
    selfProjects: 'Project'
    stripeProducts: 'StripeProduct'
  }
  StatusResponse: { // field return type name
    message: 'String'
    ok: 'Boolean'
  }
  StripeInvoice: { // field return type name
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
    subtotal: 'Int'
    tax: 'Int'
    total: 'Int'
  }
  StripePaymentMethod: { // field return type name
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
  StripePrice: { // field return type name
    active: 'Boolean'
    currency: 'String'
    id: 'String'
    interval: 'String'
    intervalCount: 'Int'
    metadata: 'Json'
    stripeProduct: 'StripeProduct'
    trialPeriodDays: 'Int'
    unitAmount: 'Int'
  }
  StripeProduct: { // field return type name
    active: 'Boolean'
    id: 'String'
    image: 'String'
    metadata: 'Json'
    name: 'String'
    stripePrices: 'StripePrice'
  }
  StripeSetupIntent: { // field return type name
    clientSecret: 'String'
  }
  StripeSubscription: { // field return type name
    cancelAt: 'DateTime'
    cancelAtPeriodEnd: 'Boolean'
    canceledAt: 'DateTime'
    created: 'DateTime'
    currentPeriodEnd: 'DateTime'
    currentPeriodStart: 'DateTime'
    endedAt: 'DateTime'
    id: 'String'
    metadata: 'Json'
    quantity: 'Int'
    status: 'StripeSubscriptionStatus'
    stripePrice: 'StripePrice'
    stripePriceId: 'String'
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
  VerificationToken: { // field return type name
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
    createStripeSetupIntent: { // args
      projectId: string; // String!
    }
    deleteProject: { // args
      id: string; // String!
    }
    deleteStripePaymentMethod: { // args
      id: string; // String!
    }
    deleteTaxId: { // args
      projectId: string; // String!
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
    updateStripePaymentMethod: { // args
      input: NexusGenInputs['UpdateStripePaymentMethodInput']; // UpdateStripePaymentMethodInput!
    }
    updateTaxId: { // args
      input: NexusGenInputs['UpdateTaxIdInput']; // UpdateTaxIdInput!
    }
    updateUser: { // args
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
    updateUserProject: { // args
      input: NexusGenInputs['UpdateUserProjectInput']; // UpdateUserProjectInput!
    }
    upsertStripeSubscription: { // args
      input: NexusGenInputs['UpsertStripeSubscriptionInput']; // UpsertStripeSubscriptionInput!
    }
    verifyEmail: { // args
      token: string; // String!
    }
  }
  Project: {
    stripeInvoices: { // args
      cursor?: NexusGenInputs['StripeInvoiceWhereUniqueInput'] | null; // StripeInvoiceWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    stripePaymentMethods: { // args
      cursor?: NexusGenInputs['StripePaymentMethodWhereUniqueInput'] | null; // StripePaymentMethodWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    stripeSubscriptions: { // args
      cursor?: NexusGenInputs['StripeSubscriptionWhereUniqueInput'] | null; // StripeSubscriptionWhereUniqueInput
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
    getUserInvites: { // args
      projectId: string; // String!
    }
    project: { // args
      projectId?: string | null; // String
    }
  }
  StripeProduct: {
    stripePrices: { // args
      cursor?: NexusGenInputs['StripePriceWhereUniqueInput'] | null; // StripePriceWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
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