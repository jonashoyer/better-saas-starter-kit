import React from 'react';
import DynamicPageLayout from 'components/layouts/PageLayout/DynamicPageLayout';
import { Box } from '@mui/material';
import { prisma } from 'utils/prisma';
import { GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import MuiComponentSamples from '../components/layouts/MuiComponentSamples';

export default function Theme(props: any) {

  const router = useRouter();
  const { t } = useTranslation();

  return (
    <React.Fragment>

      <DynamicPageLayout pageTitle='Better SaaS Starter Kit'>

        <Box sx={{ pt: 14 }}>
          <MuiComponentSamples />
        </Box>

      </DynamicPageLayout>
    </React.Fragment>
  )
}


export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};