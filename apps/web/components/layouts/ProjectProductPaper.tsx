import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import { isJSONValueObject, formatCurrency } from 'shared';
import { ProjectSettingsQuery, Project, StripePrice, StripePriceType, usePurchasePriceItemsMutation } from 'types/gql';
import { Translate } from 'next-translate';
import ComponentPreview from './ComponentPreview';
import { StripeProductWithPricing } from '../../types/types';
import { LoadingButton } from '@mui/lab';
import Lazy from '../elements/Lazy';
import useDialogState from '../../hooks/useDialogState';
import dynamic from 'next/dynamic';

const LazyDialogYN = dynamic(() => import('../elements/DialogYN'));
const LazyDialogPurchase = dynamic(() => import('../elements/DialogPurchase'));


interface ProjectProductPaperProps {
  project?: ProjectSettingsQuery['project'] | Project;
  products: StripeProductWithPricing[];
}

const ProjectProductPaper = ({ project, products }: ProjectProductPaperProps) => {

  const { t, lang } = useTranslation();

  const oneTimeProducts = React.useMemo(() => products.filter(e => e.stripePrices.some(x => x.type == StripePriceType.OneTime)), [products]);

  const productPurchased = React.useMemo(() => {
    return (project.purchasedProducts as any[]).reduce<Record<string, number>>((obj, e) => ({
      ...obj,
      [e.stripeProduct.id]: (obj[e.stripeProduct.id] ?? 0) + e.quantity,
    }), {});

  }, [project.purchasedProducts]);

  return (
    <React.Fragment>
      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant='h6'>{t('pricing:products')}</Typography>
        </Box>
        <Box>
          <ComponentPreview
            components={[
              <ProjectProductList
                key={1}
                project={project}
                t={t}
                lang={lang}
                products={oneTimeProducts}
              />,
            ]}
          />
        </Box>
      </Paper>
    </React.Fragment>
  )
}

export default ProjectProductPaper;


interface ProjectProductListProps {
  project?: ProjectSettingsQuery['project'] | Project;
  t: Translate;
  lang: string;
  products: StripeProductWithPricing[];
}

const ProjectProductList = ({ project, t, lang, products }: ProjectProductListProps) => {

  const [selectedPrice, setSelectedPrice, dialogOpen] = useDialogState<StripePrice | null>();


  const [purchase, { loading }] = usePurchasePriceItemsMutation();

  return (
    <React.Fragment>
      <Lazy
        Component={LazyDialogPurchase}
        open={!!dialogOpen}
        handleClose={() => setSelectedPrice(null)}
        project={project}
        targetProductPrice={selectedPrice}
      />
      {/* <Lazy
        Component={LazyDialogYN}
        open={!!dialogOpen}
        handleClose={() => setSelectedPrice(null)}
        onSubmit={() => {
          purchase({
            variables: {
              projectId: project.id,
              priceItems: [{
                priceId: selectedPrice.id,
              }],
            }
          })
        }}
        loading={loading}
        title={t('pricing:purchaseProduct', { productName: selectedPrice?.stripeProduct.name })}
        content={t('pricing:purchaseContent', { productName: selectedPrice?.stripeProduct.name, amount: selectedPrice && formatCurrency(lang, selectedPrice.currency, selectedPrice.unitAmount / 100, { shortFraction: true }) })}
        submitText={t('pricing:purchaseConfirm', { amount: selectedPrice && formatCurrency(lang, selectedPrice.currency, selectedPrice.unitAmount / 100, { shortFraction: true }) })}
      /> */}
      {products.map((e, i) => {
        const oneTimePrices = e.stripePrices.filter(e => e.type == StripePriceType.OneTime);
        if (oneTimePrices.length > 1) console.warn(`Stripe one time product has more then one pricing '${e.name}' ${e.id}`);
        if (oneTimePrices.length == 0) console.warn(`Stripe one time product do not have a pricing '${e.name}' ${e.id}`);
        if (!e.metadata?.key) console.warn(`Stripe product missing 'key' (metadata.key) '${e.name}' ${e.id}`);

        const price = oneTimePrices[0];
        const isFeatured = isJSONValueObject(e.metadata) && !!e.metadata.featured;
        const itemSx = isFeatured ? { border: '1px solid', borderRadius: 2, borderColor: t => `${t.palette.primary.main}88` } : { borderBottom: '1px solid #eee' };
        const purchased = project.purchasedProducts.some(x => x.stripeProduct.id == e.id);

        return (
          <Box key={e.id} sx={{ py: 1.5, px: 2, display: 'flex', justifyContent: 'space-between', ...itemSx }}>
            <Box sx={{ pr: 1 }}>
              {isFeatured && <Typography variant='caption' color='primary'>{t('pricing:recommended')}</Typography>}
              <Typography variant='subtitle1'>{e.name}</Typography>
              <Typography variant='body2' color='textSecondary'>{t(`pricing:${e.metadata.key?.toLowerCase()}Description`, { default: '' })}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
              {!purchased &&
                <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {price && <PricingDisplay t={t} lang={lang} price={price} hideFree />}
                </Box>
              }
              <Box>
                <LoadingButton sx={{ minWidth: 92 }} loading={loading} disabled={purchased} variant='outlined' onClick={() => setSelectedPrice({ ...price, stripeProduct: e })}>{purchased ? t('pricing:purchased') : t('pricing:purchase')}</LoadingButton>
              </Box>
            </Box>
          </Box>
        )
      })}
    </React.Fragment>
  )
}

export const PricingDisplay = ({ t, lang, price, hideFree }: { t: Translate, lang: string, price: Pick<StripePrice, 'unitAmount' | 'interval' | 'intervalCount' | 'currency'>, hideFree?: boolean }) => {

  if (price.unitAmount == 0) return hideFree ? null : <Typography sx={{ lineHeight: '1' }} variant='subtitle1'>{t('pricing:free')}</Typography>;

  return (
    <React.Fragment>
      <Typography sx={{ lineHeight: '1' }} variant='subtitle1'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })}</Typography>
    </React.Fragment>
  )
}