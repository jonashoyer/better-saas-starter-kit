import React from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { AppProps } from 'next/app';
import { AppNextPage } from '../../types/types';

export type AuthGuardProps = Pick<AppProps, 'pageProps'> & { Component: AppNextPage };

export function AuthGuard({ Component, pageProps }: AuthGuardProps) {

  const router = useRouter();
  const { data: session, status } = useSession();

  const { authGuard = 'public' } = Component;

  if (authGuard != 'public') {

    if (status === 'loading') {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 8 }}>
            <CircularProgress />
          </Box>
        </Box>
      )
    }

    if (!!session != (authGuard == 'authenticated')) {
      router.push(authGuard == 'authenticated' ? '/login' : '/');
      return null;
    }
  }

  return (
    <Component {...pageProps} />
  )
}