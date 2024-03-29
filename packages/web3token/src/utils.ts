import Web3 from "web3";
import { Web3TokenError } from "./errors";
import {
  hashPersonalMessage,
  toBuffer,
  fromRpcSig,
  ecrecover,
  publicToAddress,
  bufferToHex
} from 'ethereumjs-util';

export const asciiToBase64 = (str: string) => {
  if (typeof btoa === 'undefined') {
    return new Buffer(str, 'binary').toString('base64');
  }
  return btoa(str);
}

export const base64ToASCII = (base64: string) => {
  if (typeof atob === 'undefined') {
    return new Buffer(base64, 'base64').toString('binary');
  }
  return atob(base64);
}

export const strip0x = (s: string) => s.startsWith('0x') ? s.slice(2) : s;
export const prefix0x = (s: string) => s.startsWith('0x') ? s : '0x' + s;

export const hexToBase64 = (hex: string) => {
  return asciiToBase64(hex.match(/\w{2}/g)!.map(function(a) {
    return String.fromCharCode(parseInt(a, 16));
  }).join(''));
}

export const base64ToHex = (base64: string) => {
  const raw = base64ToASCII(base64);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return result;
}


export const web3TokenEncode = (payload: string | {}, signature: string) => {
  const data = asciiToBase64(typeof payload === "string" ? payload : JSON.stringify(payload));
  return [
    data,
    hexToBase64(strip0x(signature)),
  ].join('.')
}

export const web3TokenDecode = <T = {}>(token: string): { payload: T, signature: string } => {
  const [payload, signature] = token.split('.');
  const parse = (val: string) => val.startsWith('{') ? JSON.parse(val) : val; 
  return {
    payload: parse(base64ToASCII(payload)),
    signature: prefix0x(base64ToHex(signature).toLowerCase()),
  };
}

export const signWeb3Token = async (web3: Web3, account: string, message: string, payload: {}): Promise<string> => {
  const signature = await (web3 as any).eth.personal.sign(message, account);
  return web3TokenEncode(payload, signature);
}

export const verifyWeb3Token = async (message: string, signature: string) => {
  if (!signature) throw new Web3TokenError('w3t signature is required');
  try {

    const buf = Buffer.from(message);
    const msgHash = hashPersonalMessage(buf);
    const { v, r, s } = fromRpcSig(signature);

    const publicKey = ecrecover(
      msgHash,
      v,
      r,
      s
    );
    const addressBuffer = publicToAddress(publicKey);
    const address = bufferToHex(addressBuffer).toLowerCase();

    return address.toLowerCase();
  } catch(err) {
    throw new Web3TokenError('w3t malformed');
  }
}

export const isW3T = (str: string) => {
  const arr = str.split('.');
  return arr.length == 2 && arr[1].length == 88 && isBase64(arr[0]) && isBase64(arr[1]);
}

const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
export const isBase64 = (str: string) => {
  return base64regex.test(str);
}