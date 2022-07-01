import React from 'react';
import usePoll from './usePoll';
import { ProjectPurchasesDocument, ProjectPurchasesQuery } from 'types/gql';
import { useApolloClient } from '@apollo/client';

interface UsePollPurchasesOptions {

  projectId: string;
  onCompleted?: () => any;
  onFailed?: () => any;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePollPurchases = (options: UsePollPurchasesOptions): [() => Promise<void>, boolean, () => void] => {

  const apolloClient = useApolloClient();

  const { projectId, onCompleted, onFailed, maxTries = 15, delay = 2000, initialDelay = 2000 } = options;

  const lastIdsRef = React.useRef<string[]>(null);

  const [startPoll, loading, stopPoll] = usePoll({
    delay, initialDelay, maxTries,
    onCompleted, onFailed,
    async onPoll() {
      const { data } = await apolloClient.query<ProjectPurchasesQuery>({ query: ProjectPurchasesDocument, variables: { projectId }, fetchPolicy: 'network-only' });
      return data?.project?.purchasedProducts && lastIdsRef.current && !compare(lastIdsRef.current, toIdArray(data.project.purchasedProducts));
    }
  })

  const startPollProxy = React.useCallback(async () => {
    const { data } = await apolloClient.query<ProjectPurchasesQuery>({ query: ProjectPurchasesDocument, variables: { projectId }, fetchPolicy: 'cache-first' });
    lastIdsRef.current = toIdArray(data?.project?.purchasedProducts ?? []);
    startPoll();
  }, [apolloClient, projectId, startPoll]);

  return [startPollProxy, loading, stopPoll];
}

export default usePollPurchases;

const toIdArray = (arr: { id: string }[]) => arr.sort((a, b) => a.id.localeCompare(b.id)).map(e => e.id);

const compare = (a: string[], b: string[]) => {
  if (a.length != b.length) return false;
  return a.every(s => b.includes(s));
}