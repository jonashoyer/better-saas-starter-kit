import { MaybePromise } from 'nexus/dist/typegenTypeHelpers';
import React from 'react';
import { useLatest } from 'react-use';

interface UsePollOption {
  onCompleted?: () => any;
  onFailed?: () => any;
  onPoll: () => MaybePromise<boolean>;

  maxTries?: number;
  delay?: number;
  initialDelay?: number;
}

const usePoll = (option: UsePollOption): [() => void, boolean, () => void] => {
  const { onCompleted, onFailed, onPoll, maxTries = 8, delay = 200, initialDelay = 800 } = option;

  const latestOnCompleted = useLatest(onCompleted);
  const latestOnFailed = useLatest(onFailed);
  const latestOnPoll = useLatest(onPoll);

  const [running, setRunning] = React.useState(false);
  const triesRef = React.useRef(0);

  const retry = React.useCallback(async () => {
    if (triesRef.current == -1) return;

    const now = Date.now();
    const result = await latestOnPoll.current?.();
    if (triesRef.current == -1) return;
    
    if (result) {
      setRunning(false);
      triesRef.current = 0;
      return latestOnCompleted.current?.();
    }
    
    triesRef.current++;
    if (triesRef.current >= maxTries) {
      setRunning(false);
      triesRef.current = 0;
      return latestOnFailed.current?.();
    }

    await sleep(delay - (Date.now() - now));
    await retry();
  }, [latestOnCompleted, latestOnFailed, latestOnPoll, delay, maxTries]);

  const startPoll = React.useCallback(async () => {
    setRunning(true);
    if (triesRef.current <= 0) {
      await sleep(initialDelay);
      retry();
      return;
    }
    triesRef.current = 0;
  }, [initialDelay, retry]);

  const stopPoll = React.useCallback(() => {
    triesRef.current = -1;
  }, []);

  return [startPoll, running, stopPoll];
}

export default usePoll;

const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms)); 