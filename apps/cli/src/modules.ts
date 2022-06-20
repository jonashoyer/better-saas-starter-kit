import { PartialRecord } from 'shared';

export const workspaces = ['cli', 'api', 'web', 'worker', 'shared', 'sharedServer'] as const;
export type Workspace = typeof workspaces[number];;

export interface Module {
  name: string;
  value: string;
  folder?: string[];
  packageDependencies?: PartialRecord<Workspace, string[]>;
}

export const modules: Module[] = [
  {
    name: 'OAuth',
    value: 'oauth',
  },
  {
    name: 'Stripe',
    value: 'stripe',
  },
  {
    name: 'Job Queue System (Worker)',
    value: 'worker',
    folder: ['apps/worker'],
  },
  {
    name: 'Web3',
    value: 'web3',
    folder: ['packages/web3token'],
  },
  {
    name: 'SaaS Project Isolation Implantation',
    value: 'project',
  },
];

