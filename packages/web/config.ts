const withLocalStorage = <T>(localStorageKey: string, defaultValue: T) => {
  return (process.browser ? localStorage.getItem(localStorageKey) : undefined) ?? defaultValue;
}

export const GRAPHQL_ENDPOINT =  withLocalStorage('GRAPHQL_ENDPOINT', process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!);
export const GRAPHQL_WEBSOCKET_ENDPOINT = withLocalStorage('GRAPHQL_WEBSOCKET_ENDPOINT', process.env.NEXT_PUBLIC_GRAPHQL_WEBSOCKET_ENDPOINT!);

export const USE_DEBUG = withLocalStorage('DEBUG', 'false') == 'true';

export const DEFAULT_SUBSCRIPTION_PRICE_ID = process.env.DEFAULT_SUBSCRIPTION_PRICE_ID;