import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useTranslation from 'next-translate/useTranslation';
import { ProjectSettingsQuery, StripePrice, useUpsertStripeSubscriptionMutation } from 'types/gql';
import { formatCurrency } from 'shared';
import { Box, Divider, FormControlLabel, Switch, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import usePollSubscriptions from 'hooks/usePollSubscriptions';
import { StripeProductWithPricing } from '../../types/types';
import usePaymentMethodSelection, { PaymentMethodSelection } from '../../hooks/usePaymentMethodSelection';

export type DialogChangePlanProps = {
  open: boolean;
  handleClose: () => any;
  project?: ProjectSettingsQuery['project'];
  products: StripeProductWithPricing[];
  targetProduct?: StripeProductWithPricing;
}

export default function DialogChangePlan({ open,  handleClose, targetProduct, project }: DialogChangePlanProps) {

  const { t, lang } = useTranslation();

  const [price, setPrice] = React.useState<StripePrice | null>(null);

  const { paymentMethodSelectionProps, reset, submitPaymentMethod, cardComplete, loading: paymenthMethodLoading } = usePaymentMethodSelection({
    project,
    async onPaymentMethodAdded() {
      await pollPlan();

      upsertSubscription({
        variables: {
          input: {
            projectId: project.id,
            priceId: price.id,
          }
        },
      });
    }
  });

  const latestProductRef = React.useRef(null);

  const [upsertSubscription, { loading: upsertSubscriptionLoading }] = useUpsertStripeSubscriptionMutation();


  const [pollPlan, loadingPlan, stopPollPlan] = usePollSubscriptions({
    projectId: project.id,
    initialDelay: 800,
    delay: 1500,
    maxTries: 8,
    upcomingChange: true,
    onCompleted() {
      handleClose();
    },
    onFailed() {
      console.error('Failed to poll updated plan!');
      handleClose();
    }
  })


  React.useEffect(() => {
    if (!open) return;
    reset();
  }, [reset, open])

  React.useEffect(() => {
    if (!targetProduct) return;
    latestProductRef.current = targetProduct;
    setPrice(targetProduct.stripePrices.find(e => e.interval == 'year') || targetProduct.stripePrices[0]);
  }, [targetProduct]);


  const product: StripeProductWithPricing = targetProduct || latestProductRef.current;
  const currentPaymentMethod = project.stripePaymentMethods.find(e => e.isDefault) ?? project.stripePaymentMethods[0] ?? null;
  const interval = price && `${price.intervalCount != 1 ? price.intervalCount : ''} ${t(`pricing:${price.interval}`, { count: price.intervalCount })}`.trimStart();
  const isFree = price?.unitAmount == 0;

  const isMonthOrYearlyBilling = React.useMemo(() => {
    if (!product) return true;
    return product.stripePrices.length == 2
      && product.stripePrices.some(e => e.intervalCount == 1 && e.interval == 'month')
      && product.stripePrices.some(e => e.intervalCount == 1 && e.interval == 'year');
  }, [product]);


  const yearlyDiscount = React.useMemo(() => {
    if (!product) return;
    if (!isMonthOrYearlyBilling) return null;
    
    const pm = product.stripePrices.find(e => e.interval == 'month')
    const py = product.stripePrices.find(e => e.interval == 'year');
    return ((1 - ((py.unitAmount / 12) / pm.unitAmount)) * 100).toFixed(1);
  }, [isMonthOrYearlyBilling, product])

  const planPricingSummary = React.useMemo(() => {
    const defaultFormat = () => {
      return t('pricing:planPricingSummary', { price: formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true }), interval });;
    }
    if (!price) return null;
    if (!isMonthOrYearlyBilling || price.interval == 'month') return defaultFormat();
    const monthlyPrice = price.unitAmount / 100 / 12;
    return `${t('pricing:planPricingSummary', { price: formatCurrency(lang, price.currency, monthlyPrice, { shortFraction: true }), interval: 'month' })} · ${t('pricing:billedAnnually')}`;
  }, [interval, isMonthOrYearlyBilling, lang, price, t]);


  const primarySubscription = React.useMemo(() => {
    return project.stripeSubscriptions.find(e => e.metadata.type == 'primary');
  }, [project.stripeSubscriptions]);


  const handleChangePlan = async (data: any) => {

    if (!isFree && !currentPaymentMethod) {
      return submitPaymentMethod();
    }

    await pollPlan();

    upsertSubscription({
      variables: {
        input: {
          projectId: project.id,
          priceId: price.id,
        }
      }
    })
  }

  const loading = paymenthMethodLoading || upsertSubscriptionLoading || loadingPlan;
  const canSubmit = !loading && (isFree || !!currentPaymentMethod || cardComplete);

  
  const handleCloseProxy = () => {
    if (loading) return;
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleCloseProxy} maxWidth='sm' fullWidth>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: '1' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant='h6'>{primarySubscription?.stripePrice.unitAmount == 0 ? t('pricing:upgradeToPlan', { planName: product.metadata.key.toLowerCase() }) : t('pricing:changePlanTitle', { planName: product.metadata.key.toLowerCase() })}</Typography>
              <Typography color='textSecondary' variant='body2'>{t(`pricing:${product?.metadata.key?.toLowerCase()}Description`)}</Typography>
            </Box>

            {isMonthOrYearlyBilling &&
              <FormControlLabel
                disabled={loading}
                sx={{ mb: 2 }}
                control={
                  <Switch checked={price && price.interval == 'year'} onChange={(_, c) => setPrice(product.stripePrices.find(e => e.interval == (c ? 'year' : 'month')))} />
                }
                label={<Typography variant='subtitle2'>{`${t('pricing:payAnnually')} (-${yearlyDiscount}%)`}</Typography>}
              />
            }
            {!isFree &&
              <PaymentMethodSelection {...paymentMethodSelectionProps} />
            }
          </Box>
          {!isFree &&
            <React.Fragment>
              <Divider flexItem variant='middle' orientation='vertical' />
              <Box sx={{ flex: '0 0 220px' }}>
                <Typography sx={{ mb: 3 }} fontSize={16} variant='h6'>{t('pricing:planSummary')}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color='text' variant='body2'>{t('pricing:productNameMemberCount', { productName: product?.name, count: project.users.length })}</Typography>
                  <Typography fontSize='0.875rem' variant='body1'>{price && formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
                </Box>
                <Typography fontSize='0.725rem' color='textSecondary' variant='body2'>{planPricingSummary}</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color='textSecondary' variant='body2'>{t('pricing:subtotal')}</Typography>
                  <Typography fontSize='0.75rem' variant='body1'>{price && formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color='textSecondary' variant='body2'>{t('pricing:tax')}</Typography>
                  <Typography fontSize='0.75rem' variant='body1'>-</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color='textSecondary' variant='body2'>{t('pricing:total')}</Typography>
                  <Typography fontSize='1.15rem' variant='body1'>{price && formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
                </Box>
              </Box>
            </React.Fragment>
          }
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleCloseProxy}>{t('common:close')}</Button>
        <LoadingButton loading={loading} disabled={!canSubmit} onClick={handleChangePlan} variant='contained'>{t('pricing:changePlanConfirm')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}