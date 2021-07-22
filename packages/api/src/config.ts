import * as dotenv from 'dotenv';
import { NodeEnv } from 'bs-shared-kit';
dotenv.config();

export const NODE_ENV = (process.env.NODE_ENV || NodeEnv.Development) as NodeEnv;

export const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379/0';

export const AUTH_SECRET = process.env.AUTH_SECRET || '_secret_';

export const PORT = process.env.PORT || 4000;