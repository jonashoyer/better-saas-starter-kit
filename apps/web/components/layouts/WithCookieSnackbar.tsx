import { NoSsr } from '@mui/material';
import React from 'react';
import { useLocalStorage } from 'react-use';
import CookieSnackbar from '../elements/CookieSnackbar';

export interface CookieProvider {
  children: React.ReactNode;
  disable?: boolean;
}

const WithCookieSnackbar = ({ children }) => {
  
  const [value, setValue, remove] = useLocalStorage('allow-tracking');

  return (
    <React.Fragment>
      <NoSsr>
        <CookieSnackbar open={value == undefined} onOk={() => setValue(true)} onNoTrack={() => setValue(false)} />
      </NoSsr>
      {children}
    </React.Fragment>
  )
}

export default WithCookieSnackbar;