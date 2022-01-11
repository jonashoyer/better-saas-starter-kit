import React from "react"

export type LazyProps<P = any, T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>> = P & {
  Component: React.ReactElement<P, T>;
  open: boolean;
}

function Lazy({ Component, ...props }: LazyProps) {
  const loaded = React.useRef(false);
  if (props.open && !loaded.current) loaded.current = true;
  if (!loaded.current) return null;
  return <Component {...props} />
}

export default Lazy;