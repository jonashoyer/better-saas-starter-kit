import React from 'react';
import { GetPaymentMethodsDocument } from "types/gql";
import { hashString } from 'utils';
import { apolloClient } from 'utils/GraphqlClient';
import usePoll from './usePoll';


export interface HashablePaymentMethod {
  id: string;
  importance: string;
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
  const { projectId, paymentMethods, onCompleted, onFailed, maxTries = 8, delay = 200, initialDelay = 800 } = option;
  
  const currentHashRef = React.useRef(null);

  const [startPoll, loading] = usePoll({
    delay, initialDelay, maxTries, onCompleted, onFailed,
    async onPoll() {
      const { data } = await apolloClient.query({ query: GetPaymentMethodsDocument, variables: { projectId }, fetchPolicy: 'network-only' });
      if (!data?.currentProject?.paymentMethods) return false;

      const hash = paymentMethodListHash(data.currentProject.paymentMethods);
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
  return hashString(JSON.stringify(paymentMethods.sort((a, b) => a.id.localeCompare(b.id))));
}