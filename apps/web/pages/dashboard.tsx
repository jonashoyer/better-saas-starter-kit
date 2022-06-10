import React from 'react';
import Head from 'next/head';
import StaticPageLayout from 'components/layouts/PageLayout/StaticPageLayout';
import { signIn, signOut } from "next-auth/react";
import { Box, Button, Paper, Typography } from '@mui/material';
import ProductPricingsTable from 'components/layouts/ProductPricingsTable';
import { prisma } from 'utils/prisma';
import { GetServerSideProps } from 'next';
import ProjectSelector from 'components/layouts/ProjectSelector';
import { Constants } from 'shared';
import { setCookie } from 'utils/cookies';
import { AppNextPage } from '../types/types';
import { useUserContext } from '../contexts/UserContext';
import { fetchUserContext } from '../utils/serverSideUtils';

// FIXME: Cookie project is deleted it should fallback

const Dashboard: AppNextPage = (props: any) => {

  const { user, project, projects, loading } = useUserContext();

  return (
    <React.Fragment>

      <Head>
        <title>{Constants.APP_NAME}</title>
        <meta name="description" content="Cloud Flash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StaticPageLayout padded pageTitle='SaaS Dashboard'>
        {!user && <Button onClick={() => signIn()} variant='contained'>Login</Button>}
        {user && <Button onClick={() => signOut()} variant='contained'>Logout</Button>}
        <Paper sx={{ p: 2, my: 2 }}>
          <Typography variant='subtitle1' color='textSecondary'>Project</Typography>
          {project &&
            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
              <Typography>{project?.name}</Typography>
              <Typography color='textSecondary'>{project?.id}</Typography>
            </Box>
          }
          <Typography variant='subtitle1' color='textSecondary'>User</Typography>
          <Typography variant='body2'>{loading ? 'Loading...' : (user ? JSON.stringify(user, null, 2) : 'No session')}</Typography>
        </Paper>

        <Box sx={{ py: 1 }}>
          <ProductPricingsTable component={Paper} products={props.products} />
        </Box>

        <Box sx={{ py: 1 }}>
          <ProjectSelector projects={projects} />
        </Box>
        <Typography>Text</Typography>

      </StaticPageLayout>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { session, project, client, projectId } = await fetchUserContext(ctx);

  const products = await prisma.stripeProduct.findMany({
    where: { active: true },
    include: {
      stripePrices: {
        where: { active: true },
      }
    },
  });

  if (session?.user) {

    if (!projectId && project?.id) setCookie(ctx.res, Constants.PROJECT_ID_COOKIE_KEY, project.id, { maxAge: 31540000000 });

    return {
      props: { products, projectId: project?.id ?? null, initialApolloState: client.extract() },
    };
  }

  return {
    props: { products },
  };
}

Dashboard.authGuard = 'authenticated';
export default Dashboard;