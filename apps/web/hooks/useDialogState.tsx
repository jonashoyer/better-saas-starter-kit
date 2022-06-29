import React from 'react';

function useDialogState<T = any>(initalValue: T = null): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {

  const [value, setValue] = React.useState<T>(initalValue);
  const valueRef = React.useRef<T>(initalValue);

  React.useEffect(() => {
    if (!value) return;
    valueRef.current = value;
  }, [value]);


  return [value ?? valueRef.current, setValue, value != null];
}

export default useDialogState;