import React from 'react';
import Head from 'next/head';
import { getSession } from "next-auth/react";
import { ProjectSettingsDocument, SelfDocument, useProjectSettingsQuery, useSelfQuery } from 'types/gql';
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

  const { data: projectData } = useProjectSettingsQuery({
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

      <StaticPageLayout padded pageTitle='Project Settings'>

        {projectData &&
          <React.Fragment>
            <ProjectDetailsPaper project={projectData.project} />
            <ProjectMembersPaper project={projectData.project} self={selfData?.self} />
            <ProjectPlanPaper project={projectData.project} products={props.products} />
            <ProjectPaymentMethodPaper project={projectData.project} />
            <ProjectInvoicePaper project={projectData.project} />
            <ProjectDangerZonePaper project={projectData.project} />
          </React.Fragment>
        }

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
      stripePrices: {
        where: { active: true },
      }
    },
  });

  if (session?.user) {

    const projectId = ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY];

    await client.query({
      query: SelfDocument,
    });

    const { data: { project } } = await client.query({
      query: ProjectSettingsDocument,
      variables: {
        projectId,
      },
    })

    if (!projectId && project?.id) setCookie(ctx.res, Constants.PROJECT_ID_COOKIE_KEY, project.id, { maxAge: 31540000000 });

    return {
      props: { products, projectId: project?.id, initialApolloState: client.extract() },
    };
  }

  return {
    props: { products },
  };
}

Settings.authGuard = 'authenticated';
export default Settings;