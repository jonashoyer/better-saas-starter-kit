import React from 'react';
import Head from 'next/head';
import { getSession } from "next-auth/react";
import { CurrentProjectSettingsDocument, SelfDocument, useCurrentProjectSettingsQuery, useSelfQuery } from 'types/gql';
import { prisma } from 'utils/prisma';
import { GetServerSideProps } from 'next';
import { initializeApollo } from 'utils/GraphqlClient';
import { Constants } from 'shared';
import { setCookie } from 'utils/cookies';
import useProject from 'hooks/useProject';
import StaticPageLayout from 'components/layouts/PageLayout/StaticPageLayout';
import ProjectDetailsPaper from 'components/layouts/ProjectDetailsPaper';
import ProjectMembersPaper from 'components/layouts/ProjectMembersPaper';
import ProjectDangerZonePaper from 'components/layouts/ProjectDangerZonePaper';
import ProjectPlanPaper from 'components/layouts/ProjectPlanPaper';
import ProjectPaymentMethodPaper from 'components/layouts/ProjectPaymentMethodPaper';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProjectInvoicePaper from 'components/layouts/ProjectInvoicePaper';
import { AppNextPage, StripeProductWithPricing } from '../types/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Settings: AppNextPage<{ products: StripeProductWithPricing[] }> = (props) => {

  const [projectId] = useProject();


  const { data: selfData } = useSelfQuery();

  const { data: currentProjectData } = useCurrentProjectSettingsQuery({
    variables: {
      projectId,
    },
  });

  console.log({ products: props.products });

  return (
    <Elements stripe={stripePromise}>

      <Head>
        <title>APP</title>
        <meta name="description" content="Cloud Flash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StaticPageLayout padded pageTitle='Project Settings'>

        <ProjectDetailsPaper project={currentProjectData.currentProject} />
        <ProjectMembersPaper project={currentProjectData.currentProject} self={selfData?.self} />
        <ProjectPlanPaper project={currentProjectData.currentProject} products={props.products} />
        <ProjectPaymentMethodPaper project={currentProjectData.currentProject} />
        <ProjectInvoicePaper project={currentProjectData.currentProject} />
        <ProjectDangerZonePaper project={currentProjectData.currentProject} />

      </StaticPageLayout>
    </Elements>
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

Settings.authGuard = 'authenticated';
export default Settings;