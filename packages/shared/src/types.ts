export enum NodeEnv {
  Testing = 'testing',
  Development = 'development',
  Production = 'production',
}

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};