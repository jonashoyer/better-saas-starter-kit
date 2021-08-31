import { MaybePromise } from 'nexus/dist/typegenTypeHelpers';
import React from 'react';

interface UsePollOption {
  onCompleted?: () => any;
  onFailed?: () => any;
  onPoll: () => MaybePromise<boolean>;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePoll = (option: UsePollOption): [() => void, boolean] => {
  const { onCompleted, onFailed, onPoll, maxTries = 8, delay = 200, initialDelay = 800 } = option;

  const [loading, setLoading] = React.useState(false);
  const triesRef = React.useRef(0);

  const retry = async () => {
    const now = Date.now();
    const result = await onPoll?.();
    if (result) {
      setLoading(false);
      triesRef.current = 0;
      return onCompleted?.();
    }

    triesRef.current++;
    if (triesRef.current >= maxTries) {
      setLoading(false);
      triesRef.current = 0;
      return onFailed?.();
    }

    await sleep(delay - (Date.now() - now));
    await retry();
  }

  const startPoll = async () => {
    setLoading(true);
    if (triesRef.current == 0) {
      await sleep(initialDelay);
      retry();
      return;
    }
    triesRef.current = 0;
  }

  return [startPoll, loading];
}

export default usePoll;

const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms)); 