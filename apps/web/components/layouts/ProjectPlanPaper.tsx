import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Paper, Typography } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import { isJSONValueObject, formatCurrency } from 'shared';
import Lazy from 'components/elements/Lazy';
import { ProjectSettingsQuery, Project, StripePrice, StripeProduct, useCancelSubscriptionDowngradeMutation } from 'types/gql';
import { Translate } from 'next-translate';
import ComponentPreview from './ComponentPreview';
import { StripeProductWithPricing } from '../../types/types';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';

const LazyDialogChangePlan = dynamic(() => import('../elements/DialogChangePlan'));
const LazyDialogPlanCompare = dynamic(() => import('../elements/DialogPlanCompare'));

interface ProjectPlanPaperProps {
  project?: ProjectSettingsQuery['project'] | Project;
  products: StripeProductWithPricing[];
}

const ProjectPlanPaper = ({ project, products }: ProjectPlanPaperProps) => {

  const { t, lang } = useTranslation();
  const monthlyPriceFindFn = e => e.interval == 'month';
  const yearlyPriceFindFn = e => e.interval == 'year';

  const [changePlan, setChangePlan] = React.useState(null);
  const [showDialogPlanCompare, setShowDialogPlanCompare] = React.useState(false);

  const productPricingFn = (product: StripeProductWithPricing) => (product.stripePrices.find(yearlyPriceFindFn) || product.stripePrices.find(monthlyPriceFindFn));
  const sortedProducts = products.sort((a, b) => (productPricingFn(a)?.unitAmount ?? Infinity) - (productPricingFn(b)?.unitAmount ?? Infinity) );

  const [cancelDowngrade, { loading: cancelLoading }] = useCancelSubscriptionDowngradeMutation();

  const primarySubscription = React.useMemo(() => {
    return project?.stripeSubscriptions.find(e => e.stripePrice.stripeProduct.metadata.type == 'primary');
  }, [project?.stripeSubscriptions]);

  const currentProduct = React.useMemo(() => {
    const id = primarySubscription?.stripePrice.stripeProduct.id ?? null;
    if (!id) return null;
    return products.find(e => e.id == id) ?? null;
  }, [primarySubscription?.stripePrice.stripeProduct.id, products]);

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
        currentProduct={currentProduct}
        upcomingPriceId={primarySubscription?.upcomingStripePrice?.id}
        onCancelDowngrade={() => cancelDowngrade({ variables: { projectId: project!.id } })}
        cancelLoading={cancelLoading}
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
                onCancelDowngrade={() => cancelDowngrade({ variables: { projectId: project!.id } })}
                cancelLoading={cancelLoading}
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
  project?: ProjectSettingsQuery['project'] | Project;
  sortedProducts: StripeProductWithPricing[];
  productPricingFn: (product: StripeProductWithPricing) => StripePrice;
  t: Translate;
  lang: string;
  setChangePlan: React.Dispatch<StripeProductWithPricing>;
  setShowDialogPlanCompare: (show: boolean) => any;
}

const ProjectPlanList = ({ project, sortedProducts, productPricingFn, setChangePlan, setShowDialogPlanCompare, t, lang }: ProjectPlanListProps) => {

  const currentProduct = project.stripeSubscriptions.find(e => e.stripePrice.stripeProduct.metadata.type == 'primary')?.stripePrice.stripeProduct;
  const currentProductIndex = sortedProducts.findIndex(e => e.id == currentProduct?.id);

  return (
    <React.Fragment>
      {sortedProducts.filter(e => e.metadata.type == 'primary').map((e, i) => {
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
              <Typography variant='body2' color='textSecondary'>{t(`pricing:${e.metadata.key?.toLowerCase()}Description`, { default: '' })}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {price && <PricingDisplay t={t} lang={lang} price={price} hideFree />}
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
  project?: ProjectSettingsQuery['project'] | Project;
  sortedProducts: StripeProductWithPricing[];
  productPricingFn: (product: StripeProductWithPricing) => StripePrice;
  t: Translate;
  lang: string;
  setChangePlan: React.Dispatch<StripeProductWithPricing>;
  setShowDialogPlanCompare: (show: boolean) => any;
  cancelLoading: boolean;
  onCancelDowngrade: () => any;
}

const ProjectPlanCurrent = ({ project, sortedProducts, productPricingFn, setChangePlan, setShowDialogPlanCompare, t, lang, cancelLoading, onCancelDowngrade }: ProjectPlanCurrentProps) => {


  const subscription = project.stripeSubscriptions.find(e => e.stripePrice?.stripeProduct?.metadata.type == 'primary');
  const price = subscription?.stripePrice;
  const currentProduct = price?.stripeProduct;

  const extraSubscriptions = sortedProducts.filter(e => e.metadata.type == 'extra');

  if (!price) {
    return <Typography>Missing price data</Typography>
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
          <Box sx={{ pr: 1 }}>
            <Typography variant='subtitle1'>{currentProduct.name}</Typography>
            <Typography variant='body2' color='textSecondary'>{t(`pricing:${currentProduct?.metadata.key?.toLowerCase()}Description`, { default: '' })}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <PricingDisplay t={t} lang={lang} price={price} hideFree />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
          <Button sx={{ minWidth: 92 }} variant='outlined' onClick={() => setShowDialogPlanCompare(true)}>{price.unitAmount == 0 ? t('pricing:upgrade') : t('pricing:switch')}</Button>
        </Box>
        {subscription?.upcomingStripePrice &&
          <Box>
            <Typography variant='body2' color='textSecondary' gutterBottom>{t('pricing:subscriptionChange', { planName: subscription?.upcomingStripePrice.stripeProduct.name, seats: subscription?.upcomingQuantity <= 1 ? '' : `${subscription?.upcomingQuantity} ${t('pricing:seat', { count: subscription?.upcomingQuantity })}`, date: dayjs(subscription.upcomingStartDate).format('D MMM YYYY') })}</Typography>
            <LoadingButton sx={{ minWidth: 92 }} loading={cancelLoading} onClick={onCancelDowngrade} variant='outlined' size='small'>{t('pricing:cancelSubscriptionDowngrade')}</LoadingButton>
          </Box>
        }
      </Box>
      <Box>
        <Box>
          {extraSubscriptions.map(e => (
            <Box key={e.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
              <Box sx={{ pr: 1 }}>
                <Typography variant='subtitle1'>{e.name}</Typography>
                <Typography variant='body2' color='textSecondary'>{t(`pricing:${e?.metadata.key?.toLowerCase()}Description`, {  })}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <PricingDisplay t={t} lang={lang} price={price} hideFree />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export const PricingDisplay = ({ t, lang, price, hideFree }: { t: Translate, lang: string, price: Pick<StripePrice, 'unitAmount' | 'interval' | 'intervalCount' | 'currency'>, hideFree?: boolean }) => {

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