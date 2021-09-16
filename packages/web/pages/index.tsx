import React from 'react';
import Head from 'next/head';
import PageLayout from '../components/layouts/PageLayout';
import { useSession, signIn, signOut, getSession  } from "next-auth/client";
import { Box, Button, Paper, Typography } from '@mui/material';
import { CurrentProjectDocument, SelfProjectsDocument, useCurrentProjectQuery, useSelfProjectsQuery } from 'types/gql';
import ProductPricingsTable from 'components/layouts/ProductPricingsTable';
import prisma from 'utils/prisma';
import { GetServerSideProps } from 'next';
import ProjectSelector from 'components/layouts/ProjectSelector';
import { initializeApollo } from 'utils/GraphqlClient';
import { Constants } from 'bs-shared-kit';
import { setCookie } from 'utils/cookies';
import useProject from 'hooks/useProject';
import dayjs from 'dayjs';

// FIXME: Cookie project is deleted it should fallback

export default function Home(props: any) {

  const [projectId] = useProject();

  const [session, loading] = useSession();

  const { data: currentProjectData } = useCurrentProjectQuery({
    variables: {
      projectId,
    },
  });
  const { data: selfProjectsData } = useSelfProjectsQuery({ context: { serverless: true } });


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
        <Box sx={{ py: 1 }}>
          <Typography>{currentProjectData?.currentProject?.id} {currentProjectData?.currentProject?.name}</Typography>
          <Typography>{loading ? 'Loading...' : (session ? JSON.stringify(session, null, 2) : 'No session')}</Typography>
        </Box>

        <Box sx={{ py: 1 }}>
          <ProductPricingsTable component={Paper} products={props.products} />
        </Box>

        <Box sx={{ py: 1 }}>
          {selfProjectsData?.selfProjects &&
            <ProjectSelector
              projects={selfProjectsData.selfProjects}
            />
          }
        </Box>
        <Typography>Text</Typography>

      </PageLayout>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx) as any;

  const client = initializeApollo({}, ctx.req.headers);

  const products = await prisma.stripeProduct.findMany({
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
    })

    if (!projectId && currentProject?.id) setCookie(ctx.res, Constants.PROJECT_ID_COOKIE_KEY, currentProject.id, { maxAge: 31540000000 });

    await client.query({
      query: SelfProjectsDocument,
    });

    return {
      props: { products, projectId: currentProject?.id, initialApolloState: client.extract() },
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