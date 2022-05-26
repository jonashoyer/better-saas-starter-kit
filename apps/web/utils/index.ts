import { capitalize } from '@mui/material';
import { Prisma } from '@prisma/client';

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

export const snakeToReadable = (str: string) => capitalize(str.toLowerCase().replace(/_/g, ' '));


export const hashString = (str: string) => {
  let hash = 0;
  if (str.length == 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}