import { NodeEnv } from 'shared';
import * as dotenv from 'dotenv';
dotenv.config();

// MODULE oauth
export const JWT_SECRET = process.env.JWT_SECRET || '_default_non_secure_';
export const NEXT_AUTH_SECRET = process.env.NEXT_AUTH_SECRET || '_secret_';
// END_MODULE oauth


export const NODE_ENV = (process.env.NODE_ENV || NodeEnv.Development) as NodeEnv;

export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
export const REDIS_PORT = Number(process.env.REDIS_PORT || '6379');
export const REDIS_DB = Number(process.env.REDIS_DB || '0');
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export const DEFAULT_SUBSCRIPTION_PRICE_ID = process.env.DEFAULT_SUBSCRIPTION_PRICE_ID;