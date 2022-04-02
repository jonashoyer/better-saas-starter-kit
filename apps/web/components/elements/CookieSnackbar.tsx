import { Box, Button, Link, Snackbar } from '@mui/material';
import React from 'react';

export interface CookieSnackbarProps {
  open: boolean;
  onOk: () => void;
  onNoTrack: () => void;
}

const CookieSnackbar = ({ open, onOk, onNoTrack }: CookieSnackbarProps) => {

  return (
    <Snackbar
      open={open}
      message={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          We use cookies to improve our service.
          <Link color='#fff'>Learn more</Link>
          <Button color="primary" variant='contained' size="small" onClick={onOk}>Ok</Button>
          <Button size="small" onClick={onNoTrack}>Don&apos;t Track Me</Button>
        </Box>
      }
      ContentProps={{ sx: { py: 0 } }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  )
}

export default CookieSnackbar;