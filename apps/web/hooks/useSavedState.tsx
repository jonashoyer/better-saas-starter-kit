
import React from 'react';

function useSavedState<T = any>(key: string, initial: T = undefined): [T, (val: T) => void, () => void] {

  const [state, setState] = React.useState<T>(initial);

  React.useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved == null) return;
    try {
      setState(JSON.parse(saved));
    } catch {
      setState(initial);
    }
  }, [initial, key]);

  const proxySetState = React.useCallback((val: T) => {
    localStorage.setItem(key, JSON.stringify(val));
    setState(val);
  }, [key]);

  const remove = React.useCallback(() => {
    setState(initial);
    localStorage.removeItem(key);
  }, [initial, key]);

  return [state, proxySetState, remove];
}

export default useSavedState;