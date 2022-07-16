import type { IncomingMessage, OutgoingMessage } from 'http';
import type { NextFunction } from 'express';
import * as winston from 'winston';
import onFinished from 'on-finished';
import { LOGZIO_HOST, LOGZIO_TOKEN, GCLOUD_LOGGING, NODE_ENV } from '../config';
import dayjs from 'dayjs';

import * as gcloudLogger from '@google-cloud/logging-winston';
import LogzioWinstonTransport from 'winston-logzio';

// TODO: NPM package, SHARED SCRIPT!

interface Request extends IncomingMessage {
  body: any;
  path: string;
  user?: { id: string, username?: string };
  project?: { id: string };
  unsafeUserId?: string;
  error?: Error;
  originalUrl?: string;
}

interface Response extends OutgoingMessage {
  statusCode: number;
}

const requestMethodColor: Record<string, string> = {
  GET: '\x1b[32m',
  POST: '\x1b[36m',
  PATCH: '\x1b[33m',
  DELETE: '\x1b[31m',
  PUT: '\x1b[34m',
};

export const addLogTransports = (debug?: boolean) => {

  if (!debug) {
    if (GCLOUD_LOGGING) {
      return [
        new gcloudLogger.LoggingWinston({}),
      ];
    }

    if (LOGZIO_TOKEN && LOGZIO_HOST) {
      return [
        new LogzioWinstonTransport({
          extraFields: {},
          name: 'winston_logzio',
          token: LOGZIO_TOKEN,
          host: LOGZIO_HOST,
        }),
      ];
    }

    return [
      new winston.transports.Console(),
    ];
  }

  const devFormat = winston.format.printf((info) => {
    const timestamp = `\x1b[2m${dayjs().format('HH:mm:ss.SSS')}\x1b[0m`;
    const infoLevelStr = !info.level.includes('info') ? `[${info.level}] ` : '';

    if (!info.httpRequest) {
      return `${infoLevelStr}${timestamp} ${info.message}`;
    }

    const methodStr = `${requestMethodColor[info.httpRequest.requestMethod]}${info.httpRequest.requestMethod.slice(0, 3)}\x1b[0m`;
    const latencyMs = (Number((BigInt(info.httpRequest.latency?.seconds ?? 0) * BigInt(1e9) + BigInt(info.httpRequest.latency?.nanos ?? 0)) / BigInt(1e4)) * 1e-2).toFixed(2);


    if (info.httpRequest.graphql) {
      const variablesJSON = JSON.stringify(info.httpRequest.graphql.variables);
      return `${infoLevelStr}${timestamp} ${methodStr} \x1b[33m${info.message} (${info.httpRequest.graphql.operationName}${255 < variablesJSON.length ? '' : `, ${variablesJSON}`
        })\x1b[0m ${latencyMs} ms`;
    }

    return `${infoLevelStr}${timestamp} ${methodStr} ${400 <= info.httpRequest.status ? `\x1b[41m${info.httpRequest.status}\x1b[0m ` : ''
      }${info.message} ${latencyMs} ms`;
  });

  return [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), devFormat),
    }),
  ]
};

export const logger = winston.createLogger({
  transports: addLogTransports(NODE_ENV == 'production'),
});




const emitRequestLogEntry = (httpRequest: ReturnType<typeof makeHttpRequestData>) => {

  if (httpRequest.graphql?.operationName === 'IntrospectionQuery') return;

  const payload = {
    logName: 'winston_log',
    httpRequest,
    message: httpRequest.requestUrl || 'http request',
    user: httpRequest.user,
    graphql: httpRequest.graphql && (({ variables, ...rest }) => rest)(httpRequest.graphql),
    error: httpRequest.error,
  };

  if (httpRequest.error) {
    logger.error(payload);
  } else {
    logger.info(payload);
  }
}

export const httpLoggerMiddleware = (req: Request, res: Response, next?: NextFunction) => {

  const startEpoch = process.hrtime.bigint();

  onFinished(res, () => {
    const latencyNano = (process.hrtime.bigint() - startEpoch);
    const httpRequest = makeHttpRequestData(req, res, latencyNano);
    emitRequestLogEntry(httpRequest);
  });
  
  next?.();
};


const makeHttpRequestData = (req: Request, res: Response, latencyNs: bigint) => {

  const getProtocol = (requestUrl?: string | false) => {
    if (!requestUrl) return undefined;
    try {
      const url = new URL(requestUrl);
      return url.protocol;
    }
    catch (e) {
      return undefined;
    }
  }
 
  const requestUrl = req ? (('originalUrl' in req && req.originalUrl) ?? req.url) : undefined;
  const protocol = getProtocol(requestUrl);
  const referer = req ? req.headers['referer'] : undefined;
  const userAgent = req ? req.headers['user-agent'] : undefined;
  const requestMethod = req ? req.method : undefined;
  const status = res ? res.statusCode : undefined;
  const responseSize = res ? (res.getHeader && Number(res.getHeader('Content-Length'))) ?? 0 : undefined;
  const latency = latencyNs ? {
    seconds: Number(latencyNs / BigInt(1e9)),
    nanos: Number(latencyNs % BigInt(1e9)),
  } : undefined;

  const isGraphql = req.method == 'POST' && ((typeof req.body == 'object' && !!req.body?.operationName) || req.path.includes('/graphql'));

  const getGraphqlData = () => {
    if (!isGraphql) return undefined;

    return {
      operationName: req.body.operationName,
      variables: req.body.variables,
      persistedQueryHash: req.body.extensions?.persistedQuery?.sha256Hash,
    };
  };

  const user = req.user ? { id: req.user.id, userName: req.user.username } : (req.unsafeUserId ?  { id: req.unsafeUserId, unsafe: true } : undefined);
  const project = req.project ? { id: req.project.id } : undefined;
  const error = req.error ? { error: errorStringify(req.error) } : undefined ;

  return {
    protocol,
    requestUrl,
    referer,
    userAgent,
    requestMethod,
    status,
    responseSize,
    latency,
    user,
    project,
    error,
    graphql: getGraphqlData(),
  }
};
export const errorStringify = (err: any) => {
  if (typeof err == 'object') return JSON.stringify(err, Object.getOwnPropertyNames(err));
  return String(err);
};

const severityFormat = winston.format((info) => ({
  ...info,
  severity: SeverityLookup[info.level] || SeverityLookup.default,
}));

const SeverityLookup: Record<string, string>= {
  default: 'DEFAULT',
  silly: 'DEFAULT',
  verbose: 'DEBUG',
  debug: 'DEBUG',
  http: 'notice',
  info: 'info',
  warn: 'WARNING',
  error: 'ERROR',
};