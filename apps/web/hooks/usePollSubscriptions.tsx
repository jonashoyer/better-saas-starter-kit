import React from 'react';
import usePoll from './usePoll';
import { ProjectSubscriptionsDocument, ProjectSubscriptionsQuery } from 'types/gql';
import { SubscriptionType } from 'shared';
import { useApolloClient } from '@apollo/client';

interface UsePollSubscriptionsOptions {

  subscriptionType?: SubscriptionType;
  upcomingChange?: boolean;

  projectId: string;
  onCompleted?: () => any;
  onFailed?: () => any;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePollSubscriptions = (options: UsePollSubscriptionsOptions): [() => Promise<void>, boolean, () => void] => {

  const apolloClient = useApolloClient();

  const { projectId, onCompleted, onFailed, maxTries = 8, delay = 500, initialDelay = 800 } = options;

  const lastIdsRef = React.useRef<string[]>(null);
  const lastUpcomingRef = React.useRef<string | null>(null);

  const [startPoll, loading, stopPoll] = usePoll({
    delay, initialDelay, maxTries,
    onCompleted, onFailed,
    async onPoll() {
      const { data } = await apolloClient.query<ProjectSubscriptionsQuery>({ query: ProjectSubscriptionsDocument, variables: { projectId }, fetchPolicy: 'network-only' });
      const upcoming = options.upcomingChange && subscriptionsToUpcomingKey(data.project.stripeSubscriptions) !== lastUpcomingRef.current;
      return data?.project?.stripeSubscriptions && lastIdsRef.current && (!compare(subscriptionsToStringArray(data.project.stripeSubscriptions, options.subscriptionType), lastIdsRef.current) || upcoming);
    }
  })

  const startPollProxy = React.useCallback(async () => {
    const { data } = await apolloClient.query<ProjectSubscriptionsQuery>({ query: ProjectSubscriptionsDocument, variables: { projectId }, fetchPolicy: 'cache-first' });
    lastIdsRef.current = subscriptionsToStringArray(data.project.stripeSubscriptions, options.subscriptionType);
    lastUpcomingRef.current = options.upcomingChange ? subscriptionsToUpcomingKey(data.project.stripeSubscriptions) : null;
    startPoll();
  }, [apolloClient, options.subscriptionType, options.upcomingChange, projectId, startPoll]);

  return [startPollProxy, loading, stopPoll];
}

export default usePollSubscriptions;

const subscriptionsToStringArray = (subscriptions: ProjectSubscriptionsQuery['project']['stripeSubscriptions'], subscriptionType?: SubscriptionType) => {
  return subscriptions.filter(e => !subscriptionType || e.stripePrice.stripeProduct.metadata.type === subscriptionType).map(e => e.stripePrice.id);
}

const subscriptionsToUpcomingKey = (subscriptions: ProjectSubscriptionsQuery['project']['stripeSubscriptions']) => {
  const primary = subscriptions.find(e => e.stripePrice.stripeProduct.metadata.type == 'primary');
  if (!primary?.upcomingStripePrice) return null;
  return `${new Date(primary.upcomingStartDate).getTime()}:${primary.upcomingStripePrice.id}:${primary.upcomingQuantity ?? 1}`;
}

const compare = (a: string[], b: string[]) => {
  if (a.length != b.length) return false;
  return a.every(s => b.includes(s));
}