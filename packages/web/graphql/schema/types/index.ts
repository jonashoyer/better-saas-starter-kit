import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export const JSONObject = asNexusMethod(JSONObjectResolver, 'json');
export const DateTime = asNexusMethod(DateTimeResolver, 'date');

export * as User from './User';
export * as Ping from './Ping';