import React from 'react';
import usePoll from './usePoll';
import { ProjectSubscriptionsDocument, ProjectSubscriptionsQuery } from 'types/gql';
import { SubscriptionType } from 'shared';
import { useApolloClient } from '@apollo/client';

interface UsePollSubscriptionsOptions {

  subscriptionType?: SubscriptionType;

  projectId: string;
  onCompleted?: () => any;
  onFailed?: () => any;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePollSubscriptions = (options: UsePollSubscriptionsOptions): [() => Promise<void>, boolean] => {

  const apolloClient = useApolloClient();

  const { projectId, onCompleted, onFailed, maxTries = 8, delay = 500, initialDelay = 800 } = options;

  const lastIdsRef = React.useRef<string[]>(null);

  const [startPoll, loading] = usePoll({
    delay, initialDelay, maxTries,
    onCompleted, onFailed,
    async onPoll() {
      const { data } = await apolloClient.query<ProjectSubscriptionsQuery>({ query: ProjectSubscriptionsDocument, variables: { projectId }, fetchPolicy: 'network-only' });
      return data?.project?.stripeSubscriptions && lastIdsRef.current && !compare(subscriptionsToStringArray(data.project.stripeSubscriptions, options.subscriptionType), lastIdsRef.current);
    }
  })

  const startPollProxy = async () => {
    const { data } = await apolloClient.query<ProjectSubscriptionsQuery>({ query: ProjectSubscriptionsDocument, variables: { projectId }, fetchPolicy: 'cache-first' });
    lastIdsRef.current = subscriptionsToStringArray(data.project.stripeSubscriptions, options.subscriptionType);
    startPoll();
  }

  return [startPollProxy, loading];
}

export default usePollSubscriptions;

const subscriptionsToStringArray = (subscriptions: ProjectSubscriptionsQuery['project']['stripeSubscriptions'], subscriptionType?: SubscriptionType) => {
  return subscriptions.filter(e => !subscriptionType || e.stripePrice.stripeProduct.metadata.type === subscriptionType).map(e => e.stripePrice.id);
}

const compare = (a: string[], b: string[]) => {
  if (a.length != b.length) return false;
  return a.every(s => b.includes(s));
}