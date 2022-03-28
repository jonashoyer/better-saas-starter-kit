import * as dotenv from 'dotenv';
import { NodeEnv } from 'shared';
dotenv.config();

export const NODE_ENV = (process.env.NODE_ENV || NodeEnv.Development) as NodeEnv;

export const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379/0';

// MODULE oauth
export const JWT_SECRET = process.env.JWT_SECRET || '_default_non_secure_';
export const AUTH_SECRET = process.env.AUTH_SECRET || '_secret_';
// END_MODULE oauth

export const PORT = process.env.PORT || 4000;

export const ADMIN_KEY = process.env.ADMIN_KEY;