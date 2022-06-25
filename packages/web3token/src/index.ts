import ms from 'ms';
import Web3 from 'web3';
import { signWeb3Token, verifyWeb3Token, web3TokenDecode } from './utils';
import { v4 as uuidv4 } from 'uuid';
import { TokenExpiredError, TokenPrematureError, Web3TokenError } from './errors';

export * from './utils';
export * from './errors';


const payloadSerializer = (value: Web3TokenPayload, statement?: string) => {
  return [
    { value: value.statement ?? statement },
    { value: value.expiresAt && new Date(value.expiresAt).toUTCString(), name: 'Expires at' },
    { value: value.validAt && new Date(value.validAt).toUTCString(), name: 'Valid after' },
    { value: value.issuedAt && new Date(value.issuedAt as any).toUTCString(), name: 'Issued at' },
    { value: value.address, name: 'Address' },
    { value: value.domain, name: 'Domain' },
    { value: value.w3tid, name: 'Token ID' },
    { value: value.nonce, name: 'Nonce' },
  ]
    .filter(e => !!e.value)
    .map(e => e.name ? `${e.name}\n${e.value}` : e.value)
    .join('\n\n');
}

const optionsToPayload = (address: string, { expiresIn, validIn, omitStatement, ...options }: Web3TokenSignOptions, _omitStatement?: boolean) => ({
  ...options,
  expiresAt: expiresIn ? Date.now() + (typeof expiresIn == 'string' ? ms(expiresIn) : expiresIn) : options.expiresAt,
  validAt: validIn ? Date.now() + (typeof validIn == 'string' ? ms(validIn) : validIn) : options.validAt,
  nonce: options.nonce === true ? uuidv4() : (options.nonce ? options.nonce : undefined),
  issuedAt: options.issuedAt === true ? Date.now() : (options.issuedAt ? options.issuedAt : undefined),
  statement: _omitStatement ? undefined : options.statement,
  address,
})

export type Web3TokenPayload = { address: string } & Pick<Web3TokenSignOptions, 'expiresAt' | 'validAt' | 'issuedAt' | 'statement' | 'domain' | 'w3tid' | 'nonce'>


export interface Web3TokenSignOptions {
  expiresIn?: number | string;
  expiresAt?: number;

  validIn?: number | string;
  validAt?: number;

  issuedAt?: number | boolean;
  
  statement?: string;
  domain?: string;
  w3tid?: string;
  nonce?: number | string | boolean;

  omitStatement?: boolean;
}

const sign = async (web3: Web3, options: Web3TokenSignOptions) => {

  console.log({ eth: window.ethereum });

  if (typeof window.ethereum === 'undefined') {
    throw new Web3TokenError('metamask not installed');
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];

  if (!account) throw new Web3TokenError('no account selected');
  return await signWeb3Token(web3, account, payloadSerializer(optionsToPayload(account, options)), optionsToPayload(account, options, options.omitStatement));
}


export interface Web3TokenVerifyOptions {
  domain?: string | string[];
  statement?: string;
}

const verify = async (token: string, options?: Web3TokenVerifyOptions) => {
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

  const message = payloadSerializer(payload, options?.statement);
  const address = await verifyWeb3Token(message, signature);

  if (payload.address.toLowerCase() != address.toLowerCase()) {
    throw new Web3TokenError('w3t malformed');
  }

  return {
    address,
    payload,
  }
}

export default {
  sign,
  verify,
}
