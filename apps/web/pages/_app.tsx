import type { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultTheme } from '../constants/theme';
import { useApollo } from '../utils/GraphqlClient';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react'
import { ProjectValueProvider } from '../hooks/useProject';
import WithCookieSnackbar from '../components/layouts/WithCookieSnackbar';
import { AuthGuard } from '../components/elements/AuthGuard';


function MyApp({ Component, pageProps }: AppProps) {

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <SessionProvider session={pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={defaultTheme}>
            <ProjectValueProvider initialValue={pageProps.projectId}>
              <CssBaseline />
              <WithCookieSnackbar>
                <AuthGuard Component={Component} pageProps={pageProps} />
              </WithCookieSnackbar>
            </ProjectValueProvider>
          </ThemeProvider>
        </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;


