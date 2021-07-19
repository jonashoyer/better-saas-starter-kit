import React from 'react';
import Head from 'next/head';
import PageLayout from '../components/layouts/PageLayout';
import { useSession, signIn, signOut  } from "next-auth/client";
import { Button, Typography } from '@material-ui/core';
import { usePingQuery } from 'types/gql';

export default function Home() {

  const [session, loading] = useSession();

  usePingQuery({ context: { serverless: true } });
  // usePingQuery({ context: { serverless: true } });

  return (
    <React.Fragment>

      <Head>
        <title>APP</title>
        <meta name="description" content="Cloud Flash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout padded>

        {!session && <Button onClick={() => signIn()} variant='contained'>Login</Button>}
        {session && <Button onClick={() => signOut() } variant='contained'>Logout</Button>}
        <Typography>{loading ? 'Loading...' : (session ? JSON.stringify(session, null, 2) : 'No session')}</Typography>

      </PageLayout>
    </React.Fragment>
  )
}