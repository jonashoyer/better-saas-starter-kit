import { NodeEnv } from 'shared';
import * as dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = (process.env.NODE_ENV || NodeEnv.Development) as NodeEnv;

export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
export const REDIS_PORT = Number(process.env.REDIS_PORT ?? '6379');
export const REDIS_DB = Number(process.env.REDIS_DB ?? '0');