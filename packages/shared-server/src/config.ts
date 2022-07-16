import { NodeEnv } from 'shared';
import * as dotenv from 'dotenv';
dotenv.config();

const disableable = (val: string | undefined) => {
  if (val === undefined) return false;

  const s = val.trim();
  if (s == '' || s == 'false' || s == '0') return false;
  
  return s;
}

// MODULE oauth
export const JWT_SECRET = process.env.JWT_SECRET || '_default_non_secure_';
export const NEXT_AUTH_SECRET = process.env.NEXT_AUTH_SECRET || '_secret_';
// END_MODULE oauth


export const NODE_ENV = (process.env.NODE_ENV || NodeEnv.Development) as NodeEnv;
export const SERVICE = process.env.SERVICE || 'n/a';

export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
export const REDIS_PORT = Number(process.env.REDIS_PORT || '6379');
export const REDIS_DB = Number(process.env.REDIS_DB || '0');
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export const DEFAULT_SUBSCRIPTION_PRICE_ID = process.env.DEFAULT_SUBSCRIPTION_PRICE_ID;

export const LOGZIO_HOST = process.env.LOGZIO_HOST;
export const LOGZIO_TOKEN = process.env.LOGZIO_TOKEN;

export const GCLOUD_LOGGING = disableable(process.env.GCLOUD_LOGGING);
