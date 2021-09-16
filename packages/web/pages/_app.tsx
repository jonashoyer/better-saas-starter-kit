import type { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../constants/theme';
import { useApollo } from '../utils/GraphqlClient';
import { ApolloProvider } from '@apollo/client';
import { Provider as NextAuthProvider } from 'next-auth/client'
import { ProjectValueProvider } from 'hooks/useProject';


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
    <NextAuthProvider
      options={{
        clientMaxAge: 60 * 30,
        keepAlive: 60 * 60,
      }}
      session={pageProps.session}
    >
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <ProjectValueProvider initialValue={pageProps.projectId}>
              <CssBaseline />
              <Component {...pageProps} />
            </ProjectValueProvider>
          </ThemeProvider>
        </ApolloProvider>
    </NextAuthProvider>
  );
}

export default MyApp
