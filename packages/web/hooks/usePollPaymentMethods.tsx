import React, { VoidFunctionComponent } from 'react';
import { useGetPaymentMethodsLazyQuery } from "types/gql";
import { hashString } from 'utils';


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

  const [loading, setLoading] = React.useState(false);
  const triesRef = React.useRef(0);
  const currentHashRef = React.useRef(null);

  const [getPaymentMethods] = useGetPaymentMethodsLazyQuery({
    variables: {
      projectId,
    },
    onCompleted({ currentProject }) {
      triesRef.current++;
      if (!currentProject) return;
      const hash = paymentMethodListHash(currentProject.paymentMethods);
      if (hash != currentHashRef.current) {
        triesRef.current = 0;
        return onCompleted?.();
      }
      retry();
    },
    fetchPolicy: 'network-only',
  });

  const retry = async () => {
    if (triesRef.current >= maxTries) return onFailed?.();
    await sleep(delay);
    getPaymentMethods();
  }

  const pollUpdate = async () => {
    setLoading(true);
    currentHashRef.current = paymentMethodListHash(paymentMethods);
    if (triesRef.current == 0) {
      await sleep(initialDelay);
      getPaymentMethods();
      return;
    }
    triesRef.current = 0;
  }

  return [pollUpdate, loading];
}

export default usePollPaymentMethods;

const paymentMethodListHash = (paymentMethods: HashablePaymentMethod[]) => {
  return hashString(JSON.stringify(paymentMethods.sort((a, b) => a.id.localeCompare(b.id))));
}

const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms)); 