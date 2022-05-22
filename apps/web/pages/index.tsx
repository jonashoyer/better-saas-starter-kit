import React from 'react';
import DynamicPageLayout from 'components/layouts/PageLayout/DynamicPageLayout';
import { Box, Button, Paper, Typography } from '@mui/material';
import { prisma } from 'utils/prisma';
import { GetStaticProps } from 'next';
import { motion } from "framer-motion"
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import HiveIcon from '@mui/icons-material/Hive';
import InterestsIcon from '@mui/icons-material/Interests';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Image from 'next/image';

export default function Home(props: any) {

  const router = useRouter();
  const { t } = useTranslation();

  return (
    <React.Fragment>

      <DynamicPageLayout pageTitle='Better SaaS Starter Kit'>

        <Box sx={{ textAlign: 'center', minHeight: '100vh', maxWidth: 1532, mx: 'auto', pt: 1.5, px: 2 }}>
          <Box sx={{ bgcolor: '#f3f3f3', pt: 12, borderRadius: 5, mb: 2, pb: 64 }}>
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 20, delay: .45 }}
            >
              <Typography sx={{ fontSize: '1.15rem' }} color='textSecondary' variant='h5'>{t('home:heroOverline')}</Typography>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 17.5 }}
            >
              <Typography sx={{ mb: .5 }} variant='h2'>{t('home:heroTitle')}</Typography>
            </motion.div>
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 20, delay: .45 }}
            >
              <Typography sx={{ fontSize: '1rem', mb: 3 }} variant='h4'>{t('home:heroSubtitle')}</Typography>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 20, delay: .45 }}
            >
              <Button variant='contained' onClick={() => router.push('/signup')}>{t('home:heroGetStarted')}</Button>
            </motion.div>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Box
              component={motion.div}
              sx={{ position: 'absolute', mx: 'auto', width: '100%', zIndex: 1 }}
              initial={{ y: '-65%', opacity: 0 }}
              animate={{ y: '-72.5%', opacity: 1 }}
              transition={{ type: 'spring', stiffness: 17.5, delay: .9 }}
            >
              <Image width={700} height={600} src="/img/undraw_start_building_re_xani.svg" alt="Start Building" />
            </Box>
          </Box>
          <Box
            component={motion.div}
            sx={{ height: 256, borderRadius: 5, background: 'linear-gradient(150deg, #48e5fa 0%, #6b63ff 50%, #ff6584 100%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 17.5, delay: .9 }}
          />
        </Box>

        <Box sx={{ textAlign: 'center', bgcolor: '#f3f3f3', pt: 16, pb: 12 }}>
          <Typography variant='h4' sx={{ mb: 3 }}>{t('home:featuresTitle')}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 300, borderRadius: 4 }}>
              <SquareFootIcon sx={{ mb: 1 }} fontSize='large' color='primary' />
              <Typography variant='h5' sx={{ mb: 2 }}>{t('home:featuresItem1Title')}</Typography>
              <Typography variant='body1'>{t('home:featuresItem1Description')}</Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 300, borderRadius: 4 }}>
              <InterestsIcon sx={{ mb: 1 }} fontSize='large' color='primary' />
              <Typography variant='h5' sx={{ mb: 2 }}>{t('home:featuresItem2Title')}</Typography>
              <Typography variant='body1'>{t('home:featuresItem2Description')}</Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 300, borderRadius: 4 }}>
              <HiveIcon sx={{ mb: 1 }} fontSize='large' color='primary' />
              <Typography variant='h5' sx={{ mb: 2 }}>{t('home:featuresItem3Title')}</Typography>
              <Typography variant='body1'>{t('home:featuresItem3Description')}</Typography>
            </Paper>
          </Box>
        </Box>
        
        
      </DynamicPageLayout>
    </React.Fragment>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const products = await prisma.stripeProduct.findMany({
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