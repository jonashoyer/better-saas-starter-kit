import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
    first?: boolean
    last?: boolean
    before?: boolean
    after?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime' | 'Json'

// Prisma model type definitions
interface PrismaModels {
  Account: Prisma.Account
  Session: Prisma.Session
  User: Prisma.User
  UserProject: Prisma.UserProject
  Project: Prisma.Project
  BillingAccountProject: Prisma.BillingAccountProject
  BillingAccount: Prisma.BillingAccount
  PaymentMethod: Prisma.PaymentMethod
  VerificationRequest: Prisma.VerificationRequest
  Product: Prisma.Product
  ProductPrice: Prisma.ProductPrice
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    accounts: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'userId' | 'providerType' | 'providerId' | 'providerAccountId' | 'refreshToken' | 'accessToken' | 'accessTokenExpires' | 'createdAt' | 'updatedAt' | 'user'
      ordering: 'id' | 'userId' | 'providerType' | 'providerId' | 'providerAccountId' | 'refreshToken' | 'accessToken' | 'accessTokenExpires' | 'createdAt' | 'updatedAt'
    }
    sessions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'userId' | 'expires' | 'sessionToken' | 'createdAt' | 'updatedAt' | 'user'
      ordering: 'id' | 'userId' | 'expires' | 'sessionToken' | 'createdAt' | 'updatedAt'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'email' | 'emailVerified' | 'image' | 'createdAt' | 'updatedAt' | 'stripeCustomerId' | 'accounts' | 'sessions' | 'projects' | 'billingAccounts'
      ordering: 'id' | 'name' | 'email' | 'emailVerified' | 'image' | 'createdAt' | 'updatedAt' | 'stripeCustomerId'
    }
    userProjects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'userId' | 'projectId' | 'role' | 'user' | 'project'
      ordering: 'id' | 'createdAt' | 'userId' | 'projectId' | 'role'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'createdAt' | 'updatedAt' | 'users' | 'billingAccounts'
      ordering: 'id' | 'name' | 'createdAt' | 'updatedAt'
    }
    billingAccountProjects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'billingAccountId' | 'projectId' | 'billingAccount' | 'project'
      ordering: 'id' | 'createdAt' | 'billingAccountId' | 'projectId'
    }
    billingAccounts: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'paymentMethods' | 'projects'
      ordering: 'id' | 'name' | 'createdAt' | 'updatedAt' | 'userId'
    }
    paymentMethods: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'last4' | 'expMonth' | 'expYear' | 'type' | 'billingAccountId' | 'billingAccount'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'last4' | 'expMonth' | 'expYear' | 'type' | 'billingAccountId'
    }
    verificationRequests: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'identifier' | 'token' | 'expires' | 'createdAt' | 'updatedAt'
      ordering: 'id' | 'identifier' | 'token' | 'expires' | 'createdAt' | 'updatedAt'
    }
    products: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'active' | 'name' | 'description' | 'image' | 'metadata' | 'prices'
      ordering: 'id' | 'active' | 'name' | 'description' | 'image' | 'metadata'
    }
    productPrices: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'productId' | 'active' | 'currency' | 'description' | 'type' | 'unitAmount' | 'interval' | 'trial_period_days' | 'metadata' | 'product'
      ordering: 'id' | 'productId' | 'active' | 'currency' | 'description' | 'type' | 'unitAmount' | 'interval' | 'trial_period_days' | 'metadata'
    }
  },
  Account: {

  }
  Session: {

  }
  User: {
    accounts: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'userId' | 'providerType' | 'providerId' | 'providerAccountId' | 'refreshToken' | 'accessToken' | 'accessTokenExpires' | 'createdAt' | 'updatedAt' | 'user'
      ordering: 'id' | 'userId' | 'providerType' | 'providerId' | 'providerAccountId' | 'refreshToken' | 'accessToken' | 'accessTokenExpires' | 'createdAt' | 'updatedAt'
    }
    sessions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'userId' | 'expires' | 'sessionToken' | 'createdAt' | 'updatedAt' | 'user'
      ordering: 'id' | 'userId' | 'expires' | 'sessionToken' | 'createdAt' | 'updatedAt'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'userId' | 'projectId' | 'role' | 'user' | 'project'
      ordering: 'id' | 'createdAt' | 'userId' | 'projectId' | 'role'
    }
    billingAccounts: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'paymentMethods' | 'projects'
      ordering: 'id' | 'name' | 'createdAt' | 'updatedAt' | 'userId'
    }
  }
  UserProject: {

  }
  Project: {
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'userId' | 'projectId' | 'role' | 'user' | 'project'
      ordering: 'id' | 'createdAt' | 'userId' | 'projectId' | 'role'
    }
    billingAccounts: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'billingAccountId' | 'projectId' | 'billingAccount' | 'project'
      ordering: 'id' | 'createdAt' | 'billingAccountId' | 'projectId'
    }
  }
  BillingAccountProject: {

  }
  BillingAccount: {
    paymentMethods: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'last4' | 'expMonth' | 'expYear' | 'type' | 'billingAccountId' | 'billingAccount'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'brand' | 'last4' | 'expMonth' | 'expYear' | 'type' | 'billingAccountId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'billingAccountId' | 'projectId' | 'billingAccount' | 'project'
      ordering: 'id' | 'createdAt' | 'billingAccountId' | 'projectId'
    }
  }
  PaymentMethod: {

  }
  VerificationRequest: {

  }
  Product: {
    prices: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'productId' | 'active' | 'currency' | 'description' | 'type' | 'unitAmount' | 'interval' | 'trial_period_days' | 'metadata' | 'product'
      ordering: 'id' | 'productId' | 'active' | 'currency' | 'description' | 'type' | 'unitAmount' | 'interval' | 'trial_period_days' | 'metadata'
    }
  }
  ProductPrice: {
    product: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'active' | 'name' | 'description' | 'image' | 'metadata' | 'prices'
      ordering: 'id' | 'active' | 'name' | 'description' | 'image' | 'metadata'
    }
  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    account: 'Account'
    accounts: 'Account'
    session: 'Session'
    sessions: 'Session'
    user: 'User'
    users: 'User'
    userProject: 'UserProject'
    userProjects: 'UserProject'
    project: 'Project'
    projects: 'Project'
    billingAccountProject: 'BillingAccountProject'
    billingAccountProjects: 'BillingAccountProject'
    billingAccount: 'BillingAccount'
    billingAccounts: 'BillingAccount'
    paymentMethod: 'PaymentMethod'
    paymentMethods: 'PaymentMethod'
    verificationRequest: 'VerificationRequest'
    verificationRequests: 'VerificationRequest'
    product: 'Product'
    products: 'Product'
    productPrice: 'ProductPrice'
    productPrices: 'ProductPrice'
  },
  Mutation: {
    createOneAccount: 'Account'
    updateOneAccount: 'Account'
    updateManyAccount: 'AffectedRowsOutput'
    deleteOneAccount: 'Account'
    deleteManyAccount: 'AffectedRowsOutput'
    upsertOneAccount: 'Account'
    createOneSession: 'Session'
    updateOneSession: 'Session'
    updateManySession: 'AffectedRowsOutput'
    deleteOneSession: 'Session'
    deleteManySession: 'AffectedRowsOutput'
    upsertOneSession: 'Session'
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'AffectedRowsOutput'
    deleteOneUser: 'User'
    deleteManyUser: 'AffectedRowsOutput'
    upsertOneUser: 'User'
    createOneUserProject: 'UserProject'
    updateOneUserProject: 'UserProject'
    updateManyUserProject: 'AffectedRowsOutput'
    deleteOneUserProject: 'UserProject'
    deleteManyUserProject: 'AffectedRowsOutput'
    upsertOneUserProject: 'UserProject'
    createOneProject: 'Project'
    updateOneProject: 'Project'
    updateManyProject: 'AffectedRowsOutput'
    deleteOneProject: 'Project'
    deleteManyProject: 'AffectedRowsOutput'
    upsertOneProject: 'Project'
    createOneBillingAccountProject: 'BillingAccountProject'
    updateOneBillingAccountProject: 'BillingAccountProject'
    updateManyBillingAccountProject: 'AffectedRowsOutput'
    deleteOneBillingAccountProject: 'BillingAccountProject'
    deleteManyBillingAccountProject: 'AffectedRowsOutput'
    upsertOneBillingAccountProject: 'BillingAccountProject'
    createOneBillingAccount: 'BillingAccount'
    updateOneBillingAccount: 'BillingAccount'
    updateManyBillingAccount: 'AffectedRowsOutput'
    deleteOneBillingAccount: 'BillingAccount'
    deleteManyBillingAccount: 'AffectedRowsOutput'
    upsertOneBillingAccount: 'BillingAccount'
    createOnePaymentMethod: 'PaymentMethod'
    updateOnePaymentMethod: 'PaymentMethod'
    updateManyPaymentMethod: 'AffectedRowsOutput'
    deleteOnePaymentMethod: 'PaymentMethod'
    deleteManyPaymentMethod: 'AffectedRowsOutput'
    upsertOnePaymentMethod: 'PaymentMethod'
    createOneVerificationRequest: 'VerificationRequest'
    updateOneVerificationRequest: 'VerificationRequest'
    updateManyVerificationRequest: 'AffectedRowsOutput'
    deleteOneVerificationRequest: 'VerificationRequest'
    deleteManyVerificationRequest: 'AffectedRowsOutput'
    upsertOneVerificationRequest: 'VerificationRequest'
    createOneProduct: 'Product'
    updateOneProduct: 'Product'
    updateManyProduct: 'AffectedRowsOutput'
    deleteOneProduct: 'Product'
    deleteManyProduct: 'AffectedRowsOutput'
    upsertOneProduct: 'Product'
    createOneProductPrice: 'ProductPrice'
    updateOneProductPrice: 'ProductPrice'
    updateManyProductPrice: 'AffectedRowsOutput'
    deleteOneProductPrice: 'ProductPrice'
    deleteManyProductPrice: 'AffectedRowsOutput'
    upsertOneProductPrice: 'ProductPrice'
  },
  Account: {
    id: 'String'
    userId: 'String'
    providerType: 'String'
    providerId: 'String'
    providerAccountId: 'String'
    refreshToken: 'String'
    accessToken: 'String'
    accessTokenExpires: 'DateTime'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    user: 'User'
  }
  Session: {
    id: 'String'
    userId: 'String'
    expires: 'DateTime'
    sessionToken: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    user: 'User'
  }
  User: {
    id: 'String'
    name: 'String'
    email: 'String'
    emailVerified: 'DateTime'
    image: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    stripeCustomerId: 'String'
    accounts: 'Account'
    sessions: 'Session'
    projects: 'UserProject'
    billingAccounts: 'BillingAccount'
  }
  UserProject: {
    id: 'String'
    createdAt: 'DateTime'
    userId: 'String'
    projectId: 'String'
    role: 'UserRole'
    user: 'User'
    project: 'Project'
  }
  Project: {
    id: 'String'
    name: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    users: 'UserProject'
    billingAccounts: 'BillingAccountProject'
  }
  BillingAccountProject: {
    id: 'String'
    createdAt: 'DateTime'
    billingAccountId: 'String'
    projectId: 'String'
    billingAccount: 'BillingAccount'
    project: 'Project'
  }
  BillingAccount: {
    id: 'String'
    name: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    userId: 'String'
    user: 'User'
    paymentMethods: 'PaymentMethod'
    projects: 'BillingAccountProject'
  }
  PaymentMethod: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    brand: 'String'
    last4: 'String'
    expMonth: 'Int'
    expYear: 'Int'
    type: 'PaymentMethodType'
    billingAccountId: 'String'
    billingAccount: 'BillingAccount'
  }
  VerificationRequest: {
    id: 'String'
    identifier: 'String'
    token: 'String'
    expires: 'DateTime'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
  }
  Product: {
    id: 'String'
    active: 'Boolean'
    name: 'String'
    description: 'String'
    image: 'String'
    metadata: 'Json'
    prices: 'ProductPrice'
  }
  ProductPrice: {
    id: 'String'
    productId: 'String'
    active: 'Boolean'
    currency: 'String'
    description: 'String'
    type: 'String'
    unitAmount: 'Int'
    interval: 'String'
    trial_period_days: 'Int'
    metadata: 'Json'
    product: 'Product'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  Account: Typegen.NexusPrismaFields<'Account'>
  Session: Typegen.NexusPrismaFields<'Session'>
  User: Typegen.NexusPrismaFields<'User'>
  UserProject: Typegen.NexusPrismaFields<'UserProject'>
  Project: Typegen.NexusPrismaFields<'Project'>
  BillingAccountProject: Typegen.NexusPrismaFields<'BillingAccountProject'>
  BillingAccount: Typegen.NexusPrismaFields<'BillingAccount'>
  PaymentMethod: Typegen.NexusPrismaFields<'PaymentMethod'>
  VerificationRequest: Typegen.NexusPrismaFields<'VerificationRequest'>
  Product: Typegen.NexusPrismaFields<'Product'>
  ProductPrice: Typegen.NexusPrismaFields<'ProductPrice'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  