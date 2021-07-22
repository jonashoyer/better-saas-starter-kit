import { queryField } from "nexus";
import { PubSubTriggers } from "bs-shared-kit";

export const Ping = queryField('ping', {
  type: 'String',
  required: true,
  async resolve(root, args, ctx) {
    await ctx.pubsub.publish(PubSubTriggers.Ping, null);
    return 'pong';
  }
})