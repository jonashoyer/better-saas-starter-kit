import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Paper, Typography } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import { StripeProduct, StripePrice } from '@prisma/client';
import { formatCurrency } from 'shared';
import { isJSONValueObject } from 'utils';
import Lazy from 'components/elements/Lazy';
import { CurrentProjectSettingsQuery, Project } from 'types/gql';
import { Translate } from 'next-translate';
import ComponentPreview from './ComponentPreview';
import { StripeProductWithPricing } from '../../types/types';

const LazyDialogChangePlan = dynamic(() => import('../elements/DialogChangePlan'));
const LazyDialogPlanCompare = dynamic(() => import('../elements/DialogPlanCompare'));

interface ProjectPlanPaperProps {
  project?: CurrentProjectSettingsQuery['currentProject'] | Project;
  products: StripeProductWithPricing[];
}

const ProjectPlanPaper = ({ project, products }: ProjectPlanPaperProps) => {

  const { t, lang } = useTranslation();
  const monthlyPriceFindFn = e => e.interval == 'month';
  const yearlyPriceFindFn = e => e.interval == 'year';

  const [changePlan, setChangePlan] = React.useState(null);
  const [showDialogPlanCompare, setShowDialogPlanCompare] = React.useState(false);

  const productPricingFn = (product: StripeProductWithPricing) => (product.prices.find(yearlyPriceFindFn) || product.prices.find(monthlyPriceFindFn));
  const sortedProducts = products.sort((a, b) => (productPricingFn(a).unitAmount ?? Infinity) - (productPricingFn(b).unitAmount ?? Infinity) );

  return (
    <React.Fragment>
      <Lazy
        Component={LazyDialogChangePlan}
        open={!!changePlan}
        handleClose={() => setChangePlan(null)}
        project={project}
        products={products}
        targetProduct={changePlan}
      />
      <Lazy
        Component={LazyDialogPlanCompare}
        open={!!showDialogPlanCompare}
        handleClose={() => setShowDialogPlanCompare(null)}
        onPlanSwitch={(e: any) => setChangePlan(e)}
        products={products}
        currentProduct={sortedProducts.find(e => e.type == project.subscriptionPlan)}
      />
      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant='h6'>{t('common:plan')}</Typography>
        </Box>
        <Box>
          <ComponentPreview
            components={[
              <ProjectPlanCurrent
                key={0}
                project={project}
                sortedProducts={sortedProducts}
                productPricingFn={productPricingFn}
                t={t}
                lang={lang}
                setChangePlan={setChangePlan}
                setShowDialogPlanCompare={setShowDialogPlanCompare}
              />,
              <ProjectPlanList
                key={1}
                project={project}
                sortedProducts={sortedProducts}
                productPricingFn={productPricingFn}
                t={t}
                lang={lang}
                setChangePlan={setChangePlan}
                setShowDialogPlanCompare={setShowDialogPlanCompare}
              />,
            ]}
          />
        </Box>
      </Paper>
    </React.Fragment>
  )
}

export default ProjectPlanPaper;


interface ProjectPlanListProps {
  project?: CurrentProjectSettingsQuery['currentProject'] | Project;
  sortedProducts: (StripeProduct & { prices: StripePrice[] })[];
  productPricingFn: (product: StripeProductWithPricing) => StripePrice;
  t: Translate;
  lang: string;
  setChangePlan: React.Dispatch<StripeProduct & { prices: StripePrice[] }>;
  setShowDialogPlanCompare: (show: boolean) => any;
}

const ProjectPlanList = ({ project, sortedProducts, productPricingFn, setChangePlan, setShowDialogPlanCompare, t, lang }: ProjectPlanListProps) => {

  const currentProductIndex = sortedProducts.findIndex(e => e.type == project?.subscriptionPlan);

  return (
    <React.Fragment>
      {sortedProducts.map((e, i) => {
        const price = productPricingFn(e);
        const isCurrentProduct = i == currentProductIndex;

        const isFeatured = isJSONValueObject(e.metadata) && !!e.metadata.featured;

        const next = sortedProducts[i + 1];
        const isFeaturedNear = isFeatured || (next && isJSONValueObject(next.metadata) && !!next.metadata.featured);

        const itemSx = isFeatured ? { border: '1px solid', borderRadius: 2, borderColor: t => `${t.palette.primary.main}88` } : (isFeaturedNear ? {} : { borderBottom: '1px solid #eee' });

        return (
          <Box key={e.id} sx={{ py: 1.5, px: 2, display: 'flex', justifyContent: 'space-between', ...itemSx }}>
            <Box sx={{ pr: 1 }}>
              {isFeatured && <Typography variant='caption' color='primary'>{t('pricing:recommended')}</Typography>}
              <Typography variant='subtitle1'>{e.name}</Typography>
              <Typography variant='body2' color='textSecondary'>{t(`pricing:${e.type.toLowerCase()}Description`)}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <PricingDisplay t={t} lang={lang} price={price} hideFree />
              </Box>
              <Box>
                <Button sx={{ minWidth: 92 }} disabled={isCurrentProduct} variant='outlined' onClick={() => setChangePlan(e)}>{isCurrentProduct ? t('pricing:current') : (currentProductIndex < i ? t('pricing:upgrade') : t('pricing:downgrade'))}</Button>
              </Box>
            </Box>
          </Box>
        )
      })}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
        <Button sx={{ mr: 2 }} onClick={() => setShowDialogPlanCompare(true)}>{t('common:compare')}</Button>
      </Box>
    </React.Fragment>
  )
}

interface ProjectPlanCurrentProps {
  project?: CurrentProjectSettingsQuery['currentProject'] | Project;
  sortedProducts: (StripeProduct & { prices: StripePrice[] })[];
  productPricingFn: (product: StripeProductWithPricing) => StripePrice;
  t: Translate;
  lang: string;
  setChangePlan: React.Dispatch<StripeProduct & { prices: StripePrice[] }>;
  setShowDialogPlanCompare: (show: boolean) => any;
}

const ProjectPlanCurrent = ({ project, sortedProducts, productPricingFn, setChangePlan, setShowDialogPlanCompare, t, lang }: ProjectPlanCurrentProps) => {
  const currentProduct = sortedProducts.find(e => e.type == project?.subscriptionPlan);

  const price = productPricingFn(currentProduct);

  if (!price) {
    return <Typography>Missing price data</Typography>
  }

  return (
    <Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
        <Box sx={{ pr: 1 }}>
          <Typography variant='subtitle1'>{currentProduct.name}</Typography>
          <Typography variant='body2' color='textSecondary'>{t(`pricing:${currentProduct?.type.toLowerCase()}Description`)}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <PricingDisplay t={t} lang={lang} price={price} hideFree />
          </Box>
        </Box>
      </Box>
      <Button sx={{ minWidth: 92 }} variant='outlined' onClick={() => setShowDialogPlanCompare(true)}>{currentProduct?.type == 'FREE' ? t('pricing:upgrade') : t('pricing:switch')}</Button>
    </Box>
  )
}

export const PricingDisplay = ({ t, lang, price, hideFree }: { t: Translate, lang: string, price: StripePrice, hideFree?: boolean }) => {

  if (price.unitAmount == 0) return hideFree ? null : <Typography sx={{ lineHeight: '1' }} variant='subtitle1'>{t('pricing:free')}</Typography>;

  if (price.interval == 'year' && price.intervalCount == 1) {
    return (
      <React.Fragment>
        <Typography sx={{ lineHeight: '1.15' }} variant='subtitle1'>{formatCurrency(lang, price.currency, price.unitAmount / 12 / 100, { shortFraction: true })}</Typography>
        <Typography sx={{ lineHeight: '1.15' }} component='p' variant='caption' color='textSecondary'>{t('pricing:perMember')} / {t(`pricing:month`, { count: 1 })}</Typography>
        <Typography sx={{ lineHeight: '1.15' }} component='p' variant='caption' color='textSecondary'>{t('pricing:billedAnnually')}</Typography>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Typography sx={{ lineHeight: '1' }} variant='subtitle1'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })}</Typography>
      <Typography variant='caption' color='textSecondary'>{t('pricing:perMember')} / {price.intervalCount != 1 && price.intervalCount} {t(`pricing:${price.interval}`, { count: price.intervalCount })}</Typography>
    </React.Fragment>
  )
}