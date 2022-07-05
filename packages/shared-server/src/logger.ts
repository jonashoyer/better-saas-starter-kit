import pino from 'pino';
import pinoHttp from 'pino-http';

export const logger = pino();

export const httpLoggerMiddleware = pinoHttp({
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


