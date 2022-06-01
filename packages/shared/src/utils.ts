import type { Prisma } from "@prisma/client";

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