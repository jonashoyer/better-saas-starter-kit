import React from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress } from '@mui/material';
import { AppProps } from 'next/app';
import { AppNextPage } from '../../types/types';
import { useUserContext } from '../../contexts/UserContext';

export type AuthGuardProps = Pick<AppProps, 'pageProps'> & { Component: AppNextPage };

export function AuthGuard({ Component, pageProps }: AuthGuardProps) {

  const router = useRouter();
  const { user, loading } = useUserContext();

  const { authGuard = 'public' } = Component;

  if (authGuard != 'public') {

    if (loading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 8 }}>
            <CircularProgress />
          </Box>
        </Box>
      )
    }

    if (!!user != (authGuard == 'authenticated')) {
      router.push(authGuard == 'authenticated' ? '/login' : '/');
      return null;
    }
  }

  return (
    <Component {...pageProps} />
  )
}