
export interface Feature {
  name: string;
  value: string;
  dependencies: string[];
}

const features: Feature[] = [
  { name: 'OAuth', value: 'oauth', dependencies: [] },
  { name: 'Stripe', value: 'stripe', dependencies: [] },
  { name: 'Queue System', value: 'queue-system', dependencies: [] },
  { name: 'Web3', value: 'web3', dependencies: [] },
]

export default features;