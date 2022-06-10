import type { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultTheme } from '../constants/theme';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react'
import { ProjectValueProvider } from '../hooks/useProject';
import WithCookieSnackbar from '../components/layouts/WithCookieSnackbar';
import { AuthGuard } from '../components/elements/AuthGuard';
import { UserContextProvider } from '../contexts/UserContext';
import AppContinual from '../components/elements/AppContinual';
import { useGraphqlClient } from '../hooks/useGraphqlClient';
import ErrorSnackbar from '../components/elements/ErrorSnackbar';


function MyApp({ Component, pageProps }: AppProps) {

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const [requestError, setRequestError] = React.useState(null);

  const apolloClient = useGraphqlClient({
    initialState: pageProps.initialApolloState,
    onGraphQLErrors(errors) {
      setRequestError(errors);
    },
    onNetworkError(error) {
      setRequestError(error);
    },
  });

  return (
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <ProjectValueProvider initialValue={pageProps.projectId}>
          <UserContextProvider>
            <ThemeProvider theme={defaultTheme}>
              <CssBaseline />
              <AppContinual />
              <ErrorSnackbar error={requestError} onClear={() => setRequestError(null)} />
              <WithCookieSnackbar>
                <AuthGuard Component={Component} pageProps={pageProps} />
              </WithCookieSnackbar>
            </ThemeProvider>
          </UserContextProvider>
        </ProjectValueProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;


