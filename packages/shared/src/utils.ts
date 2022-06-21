import type { Prisma } from "@prisma/client";
import ms from 'ms';

export const noop = () => {};
export const pnoop = Promise.resolve();

export const formatCurrency = (lang: string, currency: string, amount: number, { shortFraction = false }) => {
  return new Intl.NumberFormat(
    lang, {
      style: 'currency',
      currency,
      minimumFractionDigits: shortFraction && amount % 1 == 0 ? 0 : 2,
    }).format(amount);
}

export const asArray = <T>(any: T | T[]): T[] => {
  if (Array.isArray(any)) return any;
  return [any];
}

export const isJSONValueObject = (jsonValue: Prisma.JsonValue): jsonValue is Prisma.JsonObject => {
  if (typeof jsonValue != 'object') return false;
  if (Array.isArray(jsonValue)) return false;
  return true;
}

export const inlineLog = (...msg: any[]) => {
  console.log(...msg);
  return true;
}

export const s = (str: string) => {
  return Math.floor(ms(str) / 1000);
}

export const isJWT = (str: string) => {
  return str.startsWith('ey') && str.split('.').length == 3;
}