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

export * as User from './User';
export * as Subscription from './Subscription';
export * as Ping from './Ping';