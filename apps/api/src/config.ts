export * from 'shared-server/dist/config'; // TODO: better exporting (% /dist/)

// MODULE oauth
export const JWT_SECRET = process.env.JWT_SECRET || '_default_non_secure_';
export const AUTH_SECRET = process.env.AUTH_SECRET || '_secret_';
// END_MODULE oauth

export const PORT = process.env.PORT || 4000;

export const ADMIN_KEY = process.env.ADMIN_KEY;
