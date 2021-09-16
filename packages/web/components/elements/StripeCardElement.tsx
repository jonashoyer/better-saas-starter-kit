

import React from "react";
import { Box, useTheme } from "@mui/material";
import { CardElement, useElements } from "@stripe/react-stripe-js";


export interface StripeCardElementProps {
  setError: (e: any) => any;
  setCardComplete: (completed: boolean) => any;
  disabled?: boolean;
  autoFocus?: boolean;
}


const StripeCardElement = ({ setError, setCardComplete, disabled, autoFocus }: StripeCardElementProps) => {

  const theme = useTheme();
  const elements = useElements();

  const colors = React.useMemo(() => ({
      BLUR: 'rgba(0, 0, 0, 0.23)',
      FOCUS: theme.palette.primary.main,
      HOVER: 'rgba(0, 0, 0, 0.87)',
  }), [theme]);

  const [state, setState] = React.useState('BLUR');
  return (
    <Box sx={{ boxSizing: 'border-box', borderStyle: 'solid', borderWidth: 1, py: 1.5, px: 1.5, borderRadius: 1, borderColor: colors[state], '&:hover': state == 'BLUR' ? { borderColor: colors.HOVER } : {} }}>
      <CardElement
        onChange={(e) => {
          setError(e.error);
          setCardComplete(e.complete);
        }}
        onFocus={() => setState('FOCUS')}
        onBlur={() => setState('BLUR')}
        onReady={() => {
          autoFocus && elements.getElement("card").focus();
        }}
        options={{
          hidePostalCode: true,
          disabled,
        }}
      />
    </Box>
  )
}

export default StripeCardElement;