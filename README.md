## Better SaaS Starter Kit

Monorepo using npm workspace

### NextJS
- NextJS
- Material UI
- NextAuth.js
- Apollo Client
- Stripe
- Next Translate (i18n)
- Serverless API
  - Apollo Server
  - BullMQ
  - Prisma, Nexus
  - Redis

### Apollo Server, Express API
- Apollo Server
- Express
- BullMQ
- Prisma, Nexus
- Redis

### BullMQ Worker
- BullMQ
- Prisma
- Redis

### To do list:
 - [ ] Basic project management
 - [ ] Basic user management
 - [ ] Stripe subscription integration
 - [ ] Basic subscription management
 - [ ] Stripe charge integration
 - [ ] Basic charge management
 - [ ] Work quene magagment
 - [ ] Server caching
 - [ ] Platform admin page
 - [ ] Landing page template
 - [ ] Web app layout template

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