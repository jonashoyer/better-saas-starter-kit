import { recoverTypedSignature_v4 } from "eth-sig-util";
import Web3 from "web3";
import { PayloadDeserializer, PayloadSerializer } from ".";
import { EIP712Message, EIP712MessageTypesType } from "./EIP712Message";

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
export const prefix0x = (s: string) => s.startsWith('0x') ? '0x' + s : s;

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

export const web3TokenDecode = (token: string) => {
  const [payload, signature] = token.split('.');
  const parse = (val: string) => val.startsWith('{') ? JSON.parse(val) : val; 
  return {
    payload: parse(base64ToASCII(payload)),
    signature: prefix0x(base64ToHex(signature).toLowerCase()),
  };
}

export const signWeb3Token = <T extends EIP712MessageTypesType, S = {}>(web3: Web3, account: string, message: EIP712Message<T>, payloadSerializer: PayloadSerializer<S>): Promise<string> => {

  const s = JSON.stringify(message);

  return new Promise((resolve, reject) => {

    (web3.currentProvider as any).sendAsync({
      method: "eth_signTypedData_v4",
      params: [account, s],
      from: account,
    }, (err: Error, result: { result: string }) => {

      if (err) return reject(err);

      const signature = result.result;
      const token = web3TokenEncode(payloadSerializer(message.message), signature);

      resolve(token);
    });
  })
}

export const verifyWeb3Token = <T extends EIP712MessageTypesType, S = {}>(message: EIP712Message<T>, token: string, payloadDeserializer: PayloadDeserializer<S>) => {

  const { payload, signature } = web3TokenDecode(token);

  const restoredMessage = {
    ...message,
    message: payloadDeserializer(payload),
  }

  const recovered = recoverTypedSignature_v4({ data: restoredMessage as any, sig: signature });
  return recovered.toLowerCase();
}