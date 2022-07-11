export enum NodeEnv {
  Testing = 'testing',
  Development = 'development',
  Production = 'production',
}

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export enum SubscriptionType {
  Primary = 'primary',
  Extra = 'extra',
}

export type StripeMetadata = Record<string, string>