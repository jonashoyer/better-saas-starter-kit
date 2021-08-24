import { capitalize } from '@material-ui/core';
import { Prisma, Product } from '@prisma/client';

export const getURL = () => {
  const url =
    process?.env?.URL && process.env.URL !== ''
      ? process.env.URL
      : process?.env?.VERCEL_URL && process.env.VERCEL_URL !== ''
      ? process.env.VERCEL_URL
      : 'http://localhost:3000';
  return url.includes('http') ? url : `https://${url}`;
};

export const postData = async ({ url, token, data = {} }: { url: string, token: string, data: any }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  return res.json();
};

export const isJSONValueObject = (jsonValue: Prisma.JsonValue): jsonValue is Prisma.JsonObject => {
  if (typeof jsonValue != 'object') return false;
  if (Array.isArray(jsonValue)) return false;
  return true;
}

export const snakeToReadable = (str: string) => capitalize(str.toLowerCase().replace(/_/g, ' '));