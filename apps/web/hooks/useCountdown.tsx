import React from 'react';
import { useLatest } from 'react-use';

export interface UseCountdownProps {
  onCompleted?: () => void;
}

const useCountdown = (props?: UseCountdownProps) => {

  const latestOnCompleted = useLatest(props?.onCompleted);

  const [time, setTime] = React.useState(0);
  const [running, setRunning] = React.useState(false);


  const start = (secounds: number) => {
    setRunning(true);
    setTime(secounds);
  }

  const stop = () => {
    setRunning(false);
  }

  React.useEffect(() => {

    if (!running) return;

    const interval = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [running]);

  React.useEffect(() => {
    if (time > 0) return;
    setRunning(false);
    latestOnCompleted.current?.();
  }, [latestOnCompleted, time]);

  return {
    time,
    running,
    start,
    stop,
  }
}

export default useCountdown;