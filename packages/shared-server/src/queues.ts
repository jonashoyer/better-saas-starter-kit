import { QueueManagerEntity } from "./QueueManager";
import { PubSubTriggers } from "./PubSubTriggers";
import { QueueManager } from "./QueueManager";
import { RedisPubSub } from 'graphql-redis-subscriptions';

export function T<T = any, R = any, N extends string = string>(args?: QueueManagerEntity<T, R, N>): QueueManagerEntity<T, R, N> {
  return args ?? {};
}

export const queues = {
  ping: T<null, void>(),
}

export const createDefaultProcessors = (pubsub: RedisPubSub) => ({
  ping: async () => { pubsub.publish(PubSubTriggers.Ping, Date.now()) }
})

export const defaultQueueMananger = (pubsub: RedisPubSub) => {
  return QueueManager({
    queues,
    processors: createDefaultProcessors(pubsub),
  })
}