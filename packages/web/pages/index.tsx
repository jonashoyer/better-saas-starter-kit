import React from 'react';
import Head from 'next/head';
import PageLayout from '../components/layouts/PageLayout';
import { useSession, signIn, signOut, getSession  } from "next-auth/client";
import { Button, Typography } from '@material-ui/core';
import { usePingQuery } from 'types/gql';
import ProductPricingsLayout from '@/components/layouts/ProductPricingsLayout';
import prisma from '@/utils/prisma';
import { GetServerSideProps, GetStaticProps } from 'next';
import ProjectList from '@/components/layouts/ProjectButtonList';
import Selector from '@/components/elements/Selector';
import ProjectButton from '@/components/elements/ProjectButton';
import ProjectSelector from '@/components/layouts/ProjectSelector';

export default function Home(props: any) {

  const [session, loading] = useSession();

  usePingQuery({ context: { serverless: true } });

  const [projectSelectorOpen, setProjectSelectorOpen] = React.useState(false);

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

        {props.projects && <ProjectList projects={props.projects} />}

        <ProductPricingsLayout products={props.products} />

        <ProjectSelector
          currentProject={{ id: '0', name: 'Hello' }}
          projects={[{ id: '1', name: 'Hello' }, { id: '2', name: 'world' }]}
        />
        <Typography>Text</Typography>

      </PageLayout>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx) as any;

  const userProjects = session?.user && await prisma.userProject.findMany({
    where: { userId: session.user.id },
    select: {
      project: {
        select: {
          id: true,
          name: true,
        }
      } 
    }
  });

  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      prices: {
        where: { active: true },
      }
    },
  });
  return {
    props: { products, projects: userProjects?.map(e => e.project) ?? null },
    // revalidate: 300,
  };
}


// export const getStaticProps: GetStaticProps = async () => {
//   const products = await prisma.product.findMany({
//     where: { active: true },
//     include: {
//       prices: {
//         where: { active: true },
//       }
//     },
//   });
//   return {
//     props: { products },
//     revalidate: 300,
//   };
// };