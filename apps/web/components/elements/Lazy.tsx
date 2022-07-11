import React from "react"

export type LazyProps<P = any> = P & {
  Component: React.ComponentType<P>;
  open: boolean;
}

function Lazy<P = any>({ Component, ...props }: LazyProps<P>) {
  const loaded = React.useRef(false);
  if (props.open && !loaded.current) loaded.current = true;
  if (!loaded.current) return null;
  
  // @ts-ignore
  return <Component {...props} />;
}

export default Lazy;