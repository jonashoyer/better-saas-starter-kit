import Web3 from 'web3';
import { EIP712Message, EIP712MessageTypesType } from "./EIP712Message";
import { signWeb3Token, verifyWeb3Token } from './utils';

export * from './utils';
export * from './EIP712Message';


export type PayloadSerializer<S = {}> = (value: S) => string | {};
export type PayloadDeserializer<S = {}> = (value: string | {}) => S;

export interface Web3TokenOptions<T extends EIP712MessageTypesType, S = {}> {
  message: EIP712Message<T>;
  payloadSerializer: PayloadSerializer<S>;
  payloadDeserializer: PayloadDeserializer<S>;
}

export const web3Token = <T extends EIP712MessageTypesType, S = {}>(options: Web3TokenOptions<T, S>) => {

  const sign = (web3: Web3, account: string, payload: {}) => {

    const msg = {
      ...options.message,
      message: payload,
    };

    return signWeb3Token(web3, account, msg, options.payloadSerializer);
  }

  const verify = async (token: string) => {
    return verifyWeb3Token(options.message, token, options.payloadDeserializer);
  }

  return {
    sign,
    verify,
  }
}
