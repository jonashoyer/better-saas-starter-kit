import type { AppProps } from 'next/app'
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultTheme } from '../themes/default';
import { useApollo } from '../utils/GraphqlClient';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react'
import { ProjectValueProvider } from '../hooks/useProject';
import WithCookieSnackbar from '../components/layouts/WithCookieSnackbar';
import { AuthGuard } from '../components/elements/AuthGuard';
import createMultiThemeContext from '../contexts/MutliThemeContext';

export const { useContext: useMultiThemeContext, Provider: ThemeProvider } = createMultiThemeContext({
  theme: defaultTheme,
  themes: {
    default: () => defaultTheme,
    berry: () => import('../themes/berry'),
    softUI: () => import('../themes/soft-ui'),
    materialKit: () => import('../themes/material-kit'),
  },
});


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
        <ThemeProvider>
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