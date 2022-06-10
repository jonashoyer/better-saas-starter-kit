import { Queue, Worker, QueueOptions, Processor, WorkerOptions, QueueScheduler, QueueSchedulerOptions, QueueEvents, QueueEventsOptions } from 'bullmq';
import { createRedisClient } from './redisClient';

interface JobQueueOperationOptions<T = any, R = any, N extends string = string> {
  processor: Processor<T, R, N>;
}

interface JobQueueOptions<K extends string, Q extends { [P in K]: JobQueueOperationOptions<any, any, K>}> {
  operations: {
    [P in K]: Q[P];
  };
  options?: QueueOptions;
  workerOptions?: WorkerOptions;
  enableQueueSchedule?: boolean;
  enableQueueEvent?: boolean;

  queueSchedulerOptions?: QueueSchedulerOptions;
  queueEventsOptions?: QueueEventsOptions;

}

type QueueManagerQueues<Q extends Record<string, JobQueueOptions<string, any>> = any> = { [K in keyof Q]: JobQueueOptions<keyof Q[K]['operations'] & string, Q[K]['operations']> };

export type QueueManagerOptions<Q extends Record<string, JobQueueOptions<string, any>>> = {
  queues: QueueManagerQueues<Q>;
  worker?: boolean;
}


type QueueType<K extends string, Q extends JobQueueOptions<string, any>> = Q['operations'][keyof Q['operations']]['processor'] extends Processor<infer T, infer R, infer N> ? Queue<Partial<T>, R, K> : never;
type WorkerType<K extends string, Q extends JobQueueOptions<string, any>> = Q['operations'][keyof Q['operations']]['processor'] extends Processor<infer T, infer R, infer N> ? Worker<Partial<T>, R, K> : never;

export interface JobQueue<K extends string, Q extends JobQueueOptions<string, any>, W = false> {
  queue: QueueType<K, Q>;
  worker: W extends true ? WorkerType<K, Q> : never;
  queueScheduler: Q['enableQueueSchedule'] extends true ? QueueScheduler : never;
  queueEvents: Q['enableQueueEvent'] extends true ? QueueEvents : never;
}

export type QueueManagerReturn<Q extends Record<string, JobQueueOptions<string, any>>, W = false> = {
  [K in keyof Q]: JobQueue<keyof Q[K]['operations'] & string, Q[K], W>;
}

export const createQueueManager = <Q extends Record<string, JobQueueOptions<string, any>>, O extends QueueManagerOptions<Q>>(options: O): QueueManagerReturn<Q, O['worker']> => {

  const connection = createRedisClient('new');
  
  return Object.fromEntries(Object.entries(options.queues).map(([key, q]: [string, QueueManagerQueues<Q>[keyof Q]]) => {
    const queue = new Queue(key, { connection, ...q.options });

    const worker = !options.worker ? undefined : new Worker(key, job => {
      const processor = q.operations[job.name]?.processor;
      if (!processor) throw new Error(`No processor ${key}.${job.name}!`);
      return processor(job);
    }, { connection, ...q.workerOptions })

    // const workers = !options.worker ? undefined : Object.fromEntries(Object.entries(q.operations).map(([key, operation]) => {
    //   const worker = new Worker(key, operation.processor, { connection, ...operation.options });
    //   console.log('worker', worker);
    //   return [key, worker];
    // }));

    const queueScheduler = options.worker && q.enableQueueSchedule ? new QueueScheduler(key, { connection: createRedisClient('new'), ...q.queueSchedulerOptions }) : undefined;
    const queueEvents = q.enableQueueEvent ? new QueueEvents(key, { connection: createRedisClient('new'), ...q.queueEventsOptions }) : undefined;
    
    return [
      key,
      {
        queue,
        worker,
        queueScheduler,
        queueEvents,
      }
    ];
  })) as any;
}