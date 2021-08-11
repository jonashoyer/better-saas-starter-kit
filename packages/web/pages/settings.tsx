import React from 'react';
import Head from 'next/head';
import { getSession } from "next-auth/client";
import { CurrentProject_MembersDocument, useCurrentProject_MembersQuery,  } from 'types/gql';
import ProductPricingsLayout from '@/components/layouts/ProductPricingsLayout';
import prisma from '@/utils/prisma';
import { GetServerSideProps } from 'next';
import { initializeApollo } from '@/utils/GraphqlClient';
import { Constants } from 'bs-shared-kit';
import { setCookie } from '@/utils/cookies';
import useProject from '@/hooks/useProject';
import PageLayout from '@/components/layouts/PageLayout';
import ProjectDetailsPaper from '@/components/layouts/ProjectDetailsPaper';
import ProjectMembersPaper from '@/components/layouts/ProjectMembersPaper';
import { Box } from '@material-ui/core';
import ProjectDangerZonePaper from '@/components/layouts/ProjectDangerZonePaper';

export default function Home(props: any) {

  const [projectId] = useProject();

  const { data: currentProjectData } = useCurrentProject_MembersQuery({
    variables: {
      projectId,
    },
  });

  return (
    <React.Fragment>

      <Head>
        <title>APP</title>
        <meta name="description" content="Cloud Flash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout padded>

        <Box sx={{ py: 1 }}>
          <ProductPricingsLayout products={props.products} />
        </Box>

        <ProjectDetailsPaper project={currentProjectData.currentProject} />
        <ProjectMembersPaper project={currentProjectData.currentProject} />
        <ProjectDangerZonePaper project={currentProjectData.currentProject} />

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
      query: CurrentProject_MembersDocument,
      variables: {
        projectId,
      },
    })

    if (!projectId && currentProject?.id) setCookie(ctx.res, Constants.PROJECT_ID_COOKIE_KEY, currentProject.id, { maxAge: 31540000000 });

    return {
      props: { products, projectId: currentProject?.id, initialApolloState: client.extract() },
    };
  }

  return {
    props: { products },
  };
}