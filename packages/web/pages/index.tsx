import React from 'react';
import Head from 'next/head';
import PageLayout from '../components/layouts/PageLayout';
import { useSession, signIn, signOut, getSession  } from "next-auth/client";
import { Button, Typography } from '@material-ui/core';
import { CurrentProjectDocument } from 'types/gql';
import ProductPricingsLayout from '@/components/layouts/ProductPricingsLayout';
import prisma from '@/utils/prisma';
import { GetServerSideProps } from 'next';
import ProjectSelector from '@/components/layouts/ProjectSelector';
import { initializeApollo } from '@/utils/GraphqlClient';
import useProject from '../hooks/useProject';
import { Constants } from 'bs-shared-kit';
import { setCookie } from '@/utils/cookies';

export default function Home(props: any) {

  const [session, loading] = useSession();

  const [projectId] = useProject();

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
        <Typography>projectId: {projectId}</Typography>
        <Typography>{loading ? 'Loading...' : (session ? JSON.stringify(session, null, 2) : 'No session')}</Typography>

        {/* {props.projects && <ProjectList projects={props.projects} />} */}

        <ProductPricingsLayout products={props.products} />

        {props.projects &&
          <ProjectSelector
            projects={props.projects}
          />
        }
        <Typography>Text</Typography>

      </PageLayout>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx) as any;

  const client = initializeApollo({}, ctx.req.headers);

  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      prices: {
        where: { active: true },
      }
    },
  });

  if (session?.user) {

    const projectId = ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY];

    const { data: { currentProject } } = await client.query({
      query: CurrentProjectDocument,
      variables: {
        projectId,
      },
      context: { serverless: true },
    })

    if (!projectId && currentProject?.id) setCookie(ctx.res, Constants.PROJECT_ID_COOKIE_KEY, currentProject.id, { maxAge: 31540000000 });

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

    return {
      props: { products, projects: userProjects?.map(e => e.project) ?? null, currentProject },
    };
  }

  return {
    props: { products },
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