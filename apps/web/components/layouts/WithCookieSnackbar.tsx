import { NoSsr } from '@mui/material';
import React from 'react';
import useSavedState from '../../hooks/useSavedState';
import CookieSnackbar from '../elements/CookieSnackbar';

export interface CookieProvider {
  children: React.ReactNode;
  disable?: boolean;
}

const WithCookieSnackbar = ({ children }) => {
  
  const [value, setValue] = useSavedState('allow-tracking');

  return (
    <React.Fragment>
      <CookieSnackbar open={value == undefined} onOk={() => setValue(true)} onNoTrack={() => setValue(false)} />
      {children}
    </React.Fragment>
  )
}

export default WithCookieSnackbar;