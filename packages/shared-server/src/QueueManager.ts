import { Queue, Worker, QueueOptions, Processor, WorkerOptions, QueueScheduler, QueueSchedulerOptions, QueueEvents, QueueEventsOptions } from 'bullmq';
import { createRedisClient } from './redisClient';

interface JobQueueOperationOptions<T = any, R = any, N extends string = string> {
  processor: Processor<T, R, N>;
  options?: WorkerOptions;
}

interface JobQueueOptions<K extends string, Q extends { [P in K]: JobQueueOperationOptions<any, any, K>}> {
  operations: {
    [P in K]: Q[P];
  };
  options?: QueueOptions;
  enableQueueSchedule?: boolean;
  enableQueueEvent?: boolean;

  queueSchedulerOptions?: QueueSchedulerOptions;
  queueEventsOptions?: QueueEventsOptions;

}

type QueueManagerQueues<Q extends Record<string, JobQueueOptions<string, any>> = any> = { [K in keyof Q]: JobQueueOptions<keyof Q[K]['operations'] & string, Q[K]['operations']> };

type QueueManagerOptions<Q extends Record<string, JobQueueOptions<string, any>>> = {
  queues: QueueManagerQueues<Q>;
}


export interface JobQueue<K extends string, Q extends JobQueueOptions<string, any>> {
  queue: Q['operations'][keyof Q['operations']]['processor'] extends Processor<infer T, infer R, infer N> ? Queue<Partial<T>, R, K> : never;
  workers: { [P in keyof Q['operations']]: Q['operations'][P]['processor'] extends Processor<infer T, infer R, infer N> ? Worker<Partial<T>, R, K> : never; }
  queueScheduler: Q['enableQueueSchedule'] extends true ? QueueScheduler : never;
  queueEvents: Q['enableQueueEvent'] extends true ? QueueEvents : never;
}

export type QueueManagerReturn<Q extends Record<string, JobQueueOptions<string, any>>> = {
  [K in keyof Q]: JobQueue<keyof Q[K]['operations'] & string, Q[K]>;
}

export const createQueueManager = <Q extends Record<string, JobQueueOptions<string, any>>>(options: QueueManagerOptions<Q>): QueueManagerReturn<Q> => {

  const connection = createRedisClient('new');
  
  return Object.fromEntries(Object.entries(options.queues).map(([key, q]: [string, QueueManagerQueues<Q>[keyof Q]]) => {
    const queue = new Queue(key, { connection, ...q.options });

    const workers = Object.fromEntries(Object.entries(q.operations).map(([key, operation]) => {
      const worker = new Worker(key, operation.processor, { connection, ...operation.options });
      return [key, worker];
    }));

    const queueScheduler = q.enableQueueSchedule ? new QueueScheduler(key, { connection: createRedisClient('new'), ...q.queueSchedulerOptions }) : undefined;
    const queueEvents = q.enableQueueEvent ? new QueueEvents(key, { connection: createRedisClient('new'), ...q.queueEventsOptions }) : undefined;
    
    return [
      key,
      {
        queue,
        workers,
        queueScheduler,
        queueEvents,
      }
    ];
  })) as any;
}