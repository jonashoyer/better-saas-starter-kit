import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';
import { asNexusMethod, scalarType } from 'nexus';

export const JSONObject = asNexusMethod(JSONObjectResolver, 'Json');
export const DateTime = asNexusMethod(DateTimeResolver, 'Date');

export const JSONScalar = scalarType({
  name: 'Json',
  asNexusMethod: 'Json',
})

export const DateTimeScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'Date',
})

export * as Mutation from './Mutation';
export * as Query from './Query';
export * as User from './User';
export * as Ping from './Ping';
export * as Checkout from './Checkout';
export * as Project from './Project';
export * as PaymentMethod from './PaymentMethod';
export * as UserProject from './UserProject';
export * as UserInvite from './UserInvite';
export * as StripeSubscription from './StripeSubscription';