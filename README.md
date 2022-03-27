## Better SaaS Starter Kit

### <span style="color:red"> 🚧 Heavily work in progress 🚧</span>

Monorepo using Turborepo and npm workspace

## What's inside?

This repo includes the following:

### Apps
- `api` An Apollo GraphQL Server, Express API server
- `web` A NextJS app with Apollo GraphQL Serverless
- `worker` A BullMQ Worker

### Packages
- `shared` Shared functions
- `shared-server` Shared Server functions
- `config` Eslint configurations
- `tsconfig` tsconfig.json's used throughout the monorepo

## Useful info and links

### Stripe CLI
https://stripe.com/docs/stripe-cli

#### Stripe CLI for MacOS

```brew install stripe/stripe-cli/stripe```

```stripe login```

```stripe listen --forward-to 127.0.0.1:3000/api/webhook```