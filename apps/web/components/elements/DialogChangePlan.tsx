import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useTranslation from 'next-translate/useTranslation';
import { ProjectSettingsQuery, PaymentMethodImportance, useCreateStripeSetupIntentMutation, useUpsertStripeSubscriptionMutation } from 'types/gql';
import { formatCurrency } from 'shared';
import { Box, capitalize, Divider, FormControlLabel, ListItem, ListItemIcon, ListItemText, Switch, Typography } from '@mui/material';
import PaymentMethodForm from './PaymentMethodForm';
import { useForm } from 'react-hook-form';
import PaymentIcon from '@mui/icons-material/Payment';
import { LoadingButton } from '@mui/lab';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import usePollPaymentMethods from 'hooks/usePollPaymentMethods';
import usePollSubscriptions from 'hooks/usePollSubscriptions';
import { StripeProductWithPricing } from '../../types/types';

export type DialogChangePlanProps = {
  open: boolean;
  handleClose: () => any;
  project?: ProjectSettingsQuery['project'];
  products: StripeProductWithPricing[];
  targetProduct?: StripeProductWithPricing;
}

export default function DialogChangePlan({ open,  handleClose, targetProduct, project }: DialogChangePlanProps) {

  const { t, lang } = useTranslation();

  const stripe = useStripe();
  const elements = useElements();

  const form = useForm({ criteriaMode: 'firstError', mode: 'all' });
  const { reset } = form;

  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [stripeClientSecret, setStripeClientSecret] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  const [price, setPrice] = React.useState(null);
  const latestProductRef = React.useRef(null);

  const [pollPaymentMethods, loadingPaymentMethods] = usePollPaymentMethods({
    projectId: project.id,
    paymentMethods: project.stripePaymentMethods,
    onCompleted() {
      setProcessing(false);
      upsertSubscription({
        variables: {
          input: {
            projectId: project.id,
            priceId: price.id,
          }
        }
      })
    },
  })

  const [pollPlan, loadingPlan] = usePollSubscriptions({
    projectId: project.id,
    initialDelay: 800,
    delay: 1000,
    maxTries: 5,
    onCompleted() {
      handleClose();
    },
    onFailed() {
      console.error('Failed to poll updated plan!');
      handleClose();
    }
  })

  const [createSetupIntent, { loading: createSetupIntentLoading }] = useCreateStripeSetupIntentMutation({
    variables: {
      projectId: project.id,
    }
  })

  const [upsertSubscription, { loading: upsertSubscriptionLoading }] = useUpsertStripeSubscriptionMutation();

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


  const currentPaymentMethod = project.stripePaymentMethods.find(e => e.importance == PaymentMethodImportance.Primary);

  const interval = price && `${price.intervalCount != 1 ? price.intervalCount : ''} ${t(`pricing:${price.interval}`, { count: price.intervalCount })}`.trimStart();

  const planPricingSummary = React.useMemo(() => {
    const defaultFormat = () => {
      return t('pricing:planPricingSummary', { price: formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true }), interval });;
    }
    if (!price) return null;
    if (!isMonthOrYearlyBilling || price.interval == 'month') return defaultFormat();
    const monthlyPrice = price.unitAmount / 100 / 12;
    return `${t('pricing:planPricingSummary', { price: formatCurrency(lang, price.currency, monthlyPrice, { shortFraction: true }), interval: 'month' })} · ${t('pricing:billedAnnually')}`;
  }, [interval, isMonthOrYearlyBilling, lang, price, t]);

  React.useEffect(() => {
    if (stripeClientSecret || currentPaymentMethod) return;
    if (!project) return;
    (async () => {
      try {
        const { data } = await createSetupIntent();
        setStripeClientSecret(data.createStripeSetupIntent.clientSecret);
      } catch (err) {
        // TODO: Catch this
        console.error(err);
      }
    })();

  }, [createSetupIntent, currentPaymentMethod, project, stripeClientSecret]);

  const primarySubscription = React.useMemo(() => {
    return project.stripeSubscriptions.find(e => e.metadata.type == 'primary');
  }, [project.stripeSubscriptions]);


  const handleChangePlan = async (data: any) => {

    const createPaymentMethod = async () => {
      if (!stripe || !elements || !stripeClientSecret) {
        return;
      }
  
      if (error) {
        elements.getElement("card").focus();
        return;
      }
  
      if (cardComplete) {
        setProcessing(true);
      }
  
  
      const payload = await stripe.confirmCardSetup(
        stripeClientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              address: {
                country: data.country.code,
              },
              name: data.fullName,
            },
          },
        }
      )
      
  
      if (payload.error) {
        console.log('[error]', payload.error);
        setError(payload.error);
        setProcessing(false);
        return;
      }

      pollPaymentMethods();
      console.log('[PaymentMethod]', payload.setupIntent);
    }

    if (!currentPaymentMethod) {
      return createPaymentMethod();
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

  const loading = processing || createSetupIntentLoading || upsertSubscriptionLoading || loadingPlan || loadingPaymentMethods;
  const canSubmit = !loading && (!!currentPaymentMethod || cardComplete);

  
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
              <Typography variant='h6'>{primarySubscription?.stripePrice.unitAmount == 0 ? t('pricing:upgradeToPlan', { planName: product.metadata.key.toLowerCase() }) : t('pricing:changePlanTitle')}</Typography>
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
            <Box>
              <Typography color='textSecondary' variant='body2'>{t('settings:paymentMethod', { count: 1 })}</Typography>
              {currentPaymentMethod &&
                <ListItem dense>
                  <ListItemIcon>
                    <PaymentIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary={`${capitalize(currentPaymentMethod.brand)} •••• ${currentPaymentMethod.last4}`} secondary={`${t('pricing:expires')} ${currentPaymentMethod.expMonth}/${currentPaymentMethod.expYear}`} />
                </ListItem>
              }
              {!currentPaymentMethod &&
                <PaymentMethodForm
                  autoFocus
                  form={form}
                  setCardComplete={setCardComplete}
                  loading={loading}
                  setError={setError}
                />
              }
            </Box>
          </Box>
          <Divider flexItem variant='middle' orientation='vertical' />
          <Box sx={{ flex: '0 0 220px' }}>
            <Typography sx={{ mb: 3 }} fontSize={16}  variant='h6'>{t('pricing:planSummary')}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='text' variant='body2'>{t('pricing:productNameMemberCount', { productName: product?.name, count: project.users.length })}</Typography>
              <Typography fontSize='0.875rem' variant='body1'>{price && formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
            </Box>
            <Typography fontSize='0.725rem' color='textSecondary' variant='body2'>{planPricingSummary}</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='textSecondary' variant='body2'>{t('pricing:subtotal')}</Typography>
              <Typography fontSize='0.75rem' variant='body1'>{price &&  formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='textSecondary' variant='body2'>{t('pricing:tax')}</Typography>
              <Typography fontSize='0.75rem' variant='body1'>-</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='textSecondary' variant='body2'>{t('pricing:total')}</Typography>
              <Typography fontSize='1.15rem' variant='body1'>{price &&  formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleCloseProxy}>{t('common:close')}</Button>
        <LoadingButton loading={loading} disabled={!canSubmit} onClick={form.handleSubmit(handleChangePlan)} variant='contained'>{t('pricing:changePlanConfirm')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}