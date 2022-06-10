import { GraphQLErrors, NetworkError } from '@apollo/client/errors';
import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { asArray } from 'shared';

export interface ErrorSnackbarProps {
  error?: GraphQLErrors | NetworkError;
  onClear: () => void;
}

const ErrorSnackbar = ({ error, onClear }: ErrorSnackbarProps) => {

  const lastMessage = React.useRef(null);

  const message = React.useMemo(() => {
    const [err] = asArray(error as any) as GraphQLErrors | NetworkError[];
    const msg = err?.message;

    if (error) lastMessage.current = msg;
    return msg;
  }, [error]);

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={(e, reason) => reason !== "clickaway" && onClear()} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={onClear} severity='error'>
        {message ?? lastMessage.current}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackbar;