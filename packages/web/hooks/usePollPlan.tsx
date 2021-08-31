import React from 'react';
import { GetCurrentProjectSubscriptionPlanDocument } from "types/gql";
import { apolloClient } from 'utils/GraphqlClient';
import usePoll from './usePoll';


export interface HashablePaymentMethod {
  id: string;
  importance: string;
}

interface UsePollPaymentMethodsOption {
  projectId: string;
  onCompleted?: () => any;
  onFailed?: () => any;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePollPlan = (option: UsePollPaymentMethodsOption): [() => void, boolean] => {
  const { projectId, onCompleted, onFailed, maxTries = 8, delay = 200, initialDelay = 800 } = option;

  const planRef = React.useRef(null);

  const [startPoll, loading] = usePoll({
    delay, initialDelay, maxTries,
    onCompleted, onFailed,
    async onPoll() {
      const { data } = await apolloClient.query({ query: GetCurrentProjectSubscriptionPlanDocument, variables: { projectId }, fetchPolicy: 'network-only' });
      return data?.currentProject?.subscriptionPlan && planRef.current != data?.currentProject?.subscriptionPlan;
    }
  })

  const startPollProxy = async () => {
    const { data } = await apolloClient.query({ query: GetCurrentProjectSubscriptionPlanDocument, variables: { projectId }, fetchPolicy: 'cache-first' });
    planRef.current = data?.currentProject?.subscriptionPlan;
    console.log(planRef.current, data?.currentProject);
    startPoll();
  }

  return [startPollProxy, loading];
}

export default usePollPlan;