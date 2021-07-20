import { subscriptionField } from 'nexus';

export const PING = 'PING';

export const Ping = subscriptionField('ping', {
  type: 'DateTime',
  subscribe(root, args, ctx) {
    return ctx.pubsub.asyncIterator(PING);
  },
  resolve(payload, args, ctx) {
    return payload;
  }
})