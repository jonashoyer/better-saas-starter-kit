import Pino from 'pino';
import PinoHttp from 'pino-http';
import { NodeEnv } from 'shared';
import { NODE_ENV } from './config';

const createTransport = () => {
  if (NODE_ENV === NodeEnv.Development) {
    return {
      target: 'pino-pretty',
      options: {
        colorize: true,
        messageFormat: '\x1b[0m\x1b[44m{res.statusCode}\x1b[0m \x1b[34m{req.method}\x1b[0m {req.url} \x1b[32m{responseTime}ms\x1b[0m',
        hideObject: true,
        ignore: 'pid,hostname',
      }
    }
  }
  return undefined;
}

export const logger = Pino({
  transport: createTransport(),
});

export const httpLoggerMiddleware = PinoHttp({
  logger,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 300 && res.statusCode < 400) return 'silent';
    return 'info';
  },
  serializers: {
    req(req) {

      if (req.headers?.cookie) {
        const { cookie, ...headers } = req.headers; 
        return {
          ...req,
          headers,
        }
      }

      return req;
    },
    res(res) {
      if (res.headers?.['set-cookie']) {
        const { 'set-cookie': _, ...headers } = res.headers; 
        return {
          ...res,
          headers,
        }
      }

      return res;
    }
  },
});


