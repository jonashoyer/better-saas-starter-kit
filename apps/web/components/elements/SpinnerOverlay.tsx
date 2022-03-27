import { Box, BoxProps, CircularProgress } from '@mui/material';
import React from 'react';

export interface SpinnerOverlayProps {
  loading?: boolean;
}

const SpinnerOverlay = ({ loading, ...props}: SpinnerOverlayProps & BoxProps) => {
  if (!loading) return null;

  return (
    <Box {...props} sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500, ...props.sx }}>
      <CircularProgress />
    </Box>
  )
}

export default SpinnerOverlay;