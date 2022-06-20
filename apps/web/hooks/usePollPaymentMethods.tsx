import React from 'react';
import { GetPaymentMethodsDocument } from "types/gql";
import { hashString } from 'utils';
import usePoll from './usePoll';
import { useApolloClient } from '@apollo/client';

export interface HashablePaymentMethod {
  id: string;
  isDefault: boolean;
}

interface UsePollPaymentMethodsOption {
  projectId: string;
  paymentMethods: HashablePaymentMethod[];
  onCompleted?: () => any;
  onFailed?: () => any;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePollPaymentMethods = (option: UsePollPaymentMethodsOption): [() => void, boolean] => {

  const apolloClient =  useApolloClient();
  
  const { projectId, paymentMethods, onCompleted, onFailed, maxTries = 8, delay = 500, initialDelay = 800 } = option;
  
  const currentHashRef = React.useRef(null);

  const [startPoll, loading] = usePoll({
    delay, initialDelay, maxTries, onCompleted, onFailed,
    async onPoll() {
      const { data } = await apolloClient.query({ query: GetPaymentMethodsDocument, variables: { projectId }, fetchPolicy: 'network-only' });
      if (!data?.project?.paymentMethods) return false;

      const hash = paymentMethodListHash(data.project.paymentMethods);
      return hash != currentHashRef.current;
    }
  });

  const pollUpdate = async () => {
    currentHashRef.current = paymentMethodListHash(paymentMethods);
    startPoll();
  }

  return [pollUpdate, loading];
}

export default usePollPaymentMethods;

const paymentMethodListHash = (paymentMethods: HashablePaymentMethod[]) => {
  return hashString(JSON.stringify(paymentMethods.map(({ id, isDefault }) => ({ id, isDefault })).sort((a, b) => a.id.localeCompare(b.id))));
}