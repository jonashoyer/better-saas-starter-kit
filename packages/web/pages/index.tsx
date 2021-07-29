import React from 'react';
import Head from 'next/head';
import PageLayout from '../components/layouts/PageLayout';
import { useSession, signIn, signOut  } from "next-auth/client";
import { Button, Typography } from '@material-ui/core';
import { usePingQuery } from 'types/gql';
import ProductPricingsLayout from '@/components/layouts/ProductPricingsLayout';
import prisma from '@/utils/prisma';
import { GetStaticProps } from 'next';

export default function Home(props: any) {

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

        <ProductPricingsLayout products={props.products} />

      </PageLayout>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      prices: {
        where: { active: true },
      }
    },
  });
  return {
    props: { products },
    revalidate: 300,
  };
};