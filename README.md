## Better SaaS Starter Kit

### <span style="color:red"> 🚧 Heavily work in progress 🚧</span>

Monorepo using npm workspace

### NextJS
- NextJS
- Material UI
- NextAuth.js
- Apollo Client
- Stripe
- Next Translate (i18n)
  
### NextJS Serverless API
- Apollo Server
- Prisma, Nexus
- BullMQ
- Redis

### Apollo Server, Express API
- Apollo Server
- Prisma, Nexus
- Express
- BullMQ
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
 - [ ] Work quene management
 - [ ] Server caching
 - [ ] Platform admin page
 - [ ] Landing page template
 - [ ] Web app layout template
 - [ ] [Going to production](https://nextjs.org/docs/going-to-production)
   - [ ] Caching
   - [ ] Reducing JavaScript Size
   - [ ] Logging
   - [ ] Sentry

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