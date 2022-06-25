import React from 'react';
import { GetPaymentMethodsDocument, GetPaymentMethodsQuery } from "types/gql";
import { hashString } from 'utils';
import usePoll from './usePoll';
import { useApolloClient } from '@apollo/client';

export interface HashablePaymentMethod {
  id: string;
  isDefault: boolean;
}

interface UsePollPaymentMethodsOption {
  projectId: string;
  onCompleted?: () => any;
  onFailed?: () => any;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePollPaymentMethods = (option: UsePollPaymentMethodsOption): [() => Promise<void>, boolean, () => void] => {

  const apolloClient =  useApolloClient();
  
  const { projectId, onCompleted, onFailed, maxTries = 8, delay = 1500, initialDelay = 800 } = option;
  
  const currentHashRef = React.useRef(null);

  const [startPoll, loading, stopPoll] = usePoll({
    delay, initialDelay, maxTries, onCompleted, onFailed,
    async onPoll() {
      const { data } = await apolloClient.query<GetPaymentMethodsQuery>({ query: GetPaymentMethodsDocument, variables: { projectId }, fetchPolicy: 'network-only' });
      if (!data?.project?.stripePaymentMethods) return false;

      const hash = paymentMethodListHash(data.project.stripePaymentMethods);
      return hash != currentHashRef.current;
    }
  });

  const proxyStartPoll = async () => {
    const { data } = await apolloClient.query<GetPaymentMethodsQuery>({ query: GetPaymentMethodsDocument, variables: { projectId }, fetchPolicy: 'cache-first' });
    currentHashRef.current = paymentMethodListHash(data.project?.stripePaymentMethods);
    startPoll();
  }

  return [proxyStartPoll, loading, stopPoll];
}

export default usePollPaymentMethods;

const paymentMethodListHash = (paymentMethods: HashablePaymentMethod[]) => {
  return hashString(JSON.stringify(paymentMethods.map(({ id, isDefault }) => ({ id, isDefault })).sort((a, b) => a.id.localeCompare(b.id))));
}