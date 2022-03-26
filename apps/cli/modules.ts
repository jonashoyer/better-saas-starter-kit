
export interface Module {
  name: string;
  value: string;
  dependencies?: string[];
}

const modules: Module[] = [
  { name: 'OAuth', value: 'oauth', dependencies: [] },
  { name: 'Stripe', value: 'stripe', dependencies: [] },
  { name: 'Queue System', value: 'queue-system', dependencies: [] },
  { name: 'Web3', value: 'web3', dependencies: [] },
]

// dependencies: npm un && comment import

export default modules;