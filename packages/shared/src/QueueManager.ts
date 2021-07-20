import { Queue, Worker, QueueOptions, Processor, WorkerOptions, JobsOptions, QueueScheduler, QueueSchedulerOptions, ConnectionOptions } from 'bullmq';
import { redisClient } from './redisClient';

export interface QueueManagerEntity<T = any, R = any, N extends string = string> {
  queueOptions?: QueueOptions;
  repeatableJobs?: {
    name: string;
    data: T;
    opts?: JobsOptions;
  }[];
  useQueueScheduler: boolean | QueueSchedulerOptions;
  
  processor?: string | Processor<T, R, N>;
  workerOptions?: WorkerOptions;
}

export interface QueueManagerTypeOptions<Q extends Record<string, QueueManagerEntity>> {
  queues: Q;
  connection?: ConnectionOptions;

  useWorkers?: boolean;
  useQueueSchedulers?: boolean;
  useRepeatableJobs?: boolean;
};
export type QueueManagerReturn<Q extends Record<string, QueueManagerEntity>> = {
  queues: {
    [K in keyof Q]: Q[K] extends QueueManagerEntity<infer T, infer R, infer N> ? Queue<T, R, N> : never;
  },
  workers: {
    [K in keyof Q]?: Q[K] extends QueueManagerEntity<infer T, infer R, infer N> ? Worker<T, R, N> : never;
  },
  queueSchedulers: {
    [K in keyof Q]?: QueueScheduler;
  }
};

export function QueueManager<Q extends Record<string, QueueManagerEntity>>(opt: QueueManagerTypeOptions<Q>): QueueManagerReturn<Q> {

  const connection = redisClient;

  const queues: Record<string, Queue> = {};
  const workers: Record<string, Worker> = {};
  const queueSchedulers: Record<string, QueueScheduler> = {};

  Object.entries(opt.queues).forEach(([key, q]) => {
    queues[key] = new Queue(key, { connection, ...q.queueOptions });

    if (opt.useWorkers && q.processor) {
      workers[key] = new Worker(key, q.processor, { connection, ...q.workerOptions });
    }
    
    if (opt.useQueueSchedulers && q.useQueueScheduler) {
      const opts = typeof q.useQueueScheduler != 'boolean' ? q.useQueueScheduler : {};
      queueSchedulers[key] = new QueueScheduler(key, { connection, ...opts });
    }

    if (opt.useRepeatableJobs && q.repeatableJobs) {
      queues[key].addBulk(q.repeatableJobs)
        .catch(err => {
          console.error(`Failed to add repeatable jobs for queue '${key}'!`, err);
        });
    }
  })

  return {
    queues,
    workers,
    queueSchedulers,
  } as any;
}

const q = QueueManager({
  queues: {
    hello: {
    } as QueueManagerEntity<string, string>
  }
})