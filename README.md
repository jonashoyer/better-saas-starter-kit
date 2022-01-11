## Better SaaS Starter Kit

### <span style="color:red"> 🚧 Heavily work in progress 🚧</span>

Monorepo using npm workspace

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `api`: an Apollo Server, Express API server
- `web`: a NextJS app with a NextJS Serverless Apollo Server
- `worker`: a BullMQ Worker
- `shared`: Shared functions
- `shared-server`: Shared Server functions
- `config`: Eslint configurations
- `tsconfig`: tsconfig.json's used throughout the monorepo

#### Shared environment variables
- REDIS_URL
- NODE_ENV
- STRIPE_SECRET_KEY

### Stripe CLI
https://stripe.com/docs/stripe-cli

#### Stripe CLI for MacOS

```brew install stripe/stripe-cli/stripe```

```stripe login```

```stripe listen --forward-to 127.0.0.1:3000/api/webhook```