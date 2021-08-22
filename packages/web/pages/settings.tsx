import React from 'react';
import Head from 'next/head';
import { getSession } from "next-auth/client";
import { CurrentProjectSettingsDocument, SelfDocument, useCurrentProjectSettingsQuery, useSelfQuery } from 'types/gql';
import prisma from 'utils/prisma';
import { GetServerSideProps } from 'next';
import { initializeApollo } from 'utils/GraphqlClient';
import { Constants } from 'bs-shared-kit';
import { setCookie } from 'utils/cookies';
import useProject from 'hooks/useProject';
import PageLayout from 'components/layouts/PageLayout';
import ProjectDetailsPaper from 'components/layouts/ProjectDetailsPaper';
import ProjectMembersPaper from 'components/layouts/ProjectMembersPaper';
import ProjectDangerZonePaper from 'components/layouts/ProjectDangerZonePaper';
import ProjectPlanPaper from 'components/layouts/ProjectPlanPaper';
import ProjectPaymentMethodPaper from 'components/layouts/ProjectPaymentMethodPaper';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Settings(props: any) {

  const [projectId] = useProject();

  const { data: selfData } = useSelfQuery();

  const { data: currentProjectData } = useCurrentProjectSettingsQuery({
    variables: {
      projectId,
    },
  });

  return (
    <Elements stripe={stripePromise}>

      <Head>
        <title>APP</title>
        <meta name="description" content="Cloud Flash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout padded>

        <ProjectDetailsPaper project={currentProjectData.currentProject} />
        <ProjectMembersPaper project={currentProjectData.currentProject} self={selfData?.self} />
        <ProjectPlanPaper project={currentProjectData.currentProject} products={props.products} />
        <ProjectPaymentMethodPaper project={currentProjectData.currentProject} />
        <ProjectDangerZonePaper project={currentProjectData.currentProject} />

      </PageLayout>
    </Elements>
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

    await client.query({
      query: SelfDocument,
    });

    const { data: { currentProject } } = await client.query({
      query: CurrentProjectSettingsDocument,
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