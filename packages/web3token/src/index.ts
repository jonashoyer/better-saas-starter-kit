import ms from 'ms';
import Web3 from 'web3';
import { signWeb3Token, verifyWeb3Token, web3TokenDecode } from './utils';
import { v4 as uuidv4 } from 'uuid';
import { TokenExpiredError, TokenPrematureError, Web3TokenError } from './errors';

export * from './utils';
export * from './errors';


const payloadSerializer: PayloadSerializer = (value: Web3TokenSignOptions) => {
  return [
    { value: value.statement },
    { value: value.expiresAt && new Date(value.expiresAt).toUTCString(), name: 'Expires at' },
    { value: value.validAt && new Date(value.validAt).toUTCString(), name: 'Valid after' },
    { value: value.issuedAt && new Date(value.issuedAt as any).toUTCString(), name: 'Issued at' },
    { value: value.domain, name: 'Domain' },
    { value: value.w3tid, name: 'Token ID' },
    { value: value.nonce, name: 'Nonce' },
  ]
    .filter(e => !!e.value)
    .map(e => e.name ? `${e.name}\n${e.value}` : e.value)
    .join('\n\n');
}

const optionsToPayload = ({ expiresIn, validIn, ...options }: Web3TokenSignOptions) => ({
  ...options,
  expiresAt: expiresIn ? Date.now() + (typeof expiresIn == 'string' ? ms(expiresIn) : expiresIn) : options.expiresAt,
  validAt: validIn ? Date.now() + (typeof validIn == 'string' ? ms(validIn) : validIn) : options.validAt,
  nonce: options.nonce === true ? uuidv4() : (options.nonce ? options.nonce : undefined),
  issuedAt: options.issuedAt === true ? Date.now() : (options.issuedAt ? options.issuedAt : undefined),
})


export type PayloadSerializer<S = {}> = (value: S) => string;

export interface Web3TokenSignOptions {
  expiresIn?: number | string;
  expiresAt?: number;

  validIn?: number | string;
  validAt?: number;

  issuedAt?: number | boolean;
  
  domain?: string;
  w3tid?: string;
  statement?: string;
  nonce?: number | string | boolean;
}

const sign = (web3: Web3, account: string, options: Web3TokenSignOptions) => {

  const payload = optionsToPayload(options);

  return signWeb3Token(web3, account, payloadSerializer(payload), payload);
}


export interface Web3TokenVerifyOptions {
  domain?: string | string[];
}

const verify = async (web3: Web3, token: string, options?: Web3TokenVerifyOptions) => {
  const { payload, signature } = web3TokenDecode<ReturnType<typeof optionsToPayload>>(token);

  if (payload.domain && options?.domain) {
    
    if (Array.isArray(options.domain)) {
      if (!options.domain.includes(payload.domain)) throw new Web3TokenError('w3t domain invalid');

    } else if (options.domain !== payload.domain) throw new Web3TokenError('w3t domain invalid');
  }

  if (payload.expiresAt) {
    if (payload.expiresAt < Date.now()) throw new TokenExpiredError(payload.expiresAt);
  }

  if (payload.validAt) {
    if (payload.validAt > Date.now()) throw new TokenPrematureError(payload.validAt);
  }

  const message = payloadSerializer(payload);
  const address = await verifyWeb3Token(web3, message, signature);

  return {
    address,
    payload,
  }
}

export default {
  sign,
  verify,
}
