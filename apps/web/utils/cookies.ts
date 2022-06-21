import { serialize, CookieSerializeOptions } from 'cookie'
import { OutgoingMessage, ServerResponse } from 'http';
import { NextApiResponse } from 'next'

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: NextApiResponse | ServerResponse | OutgoingMessage,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }
  
  res.setHeader('Set-Cookie', serialize(name, stringValue, options));
}