import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useTranslation from 'next-translate/useTranslation';
import { Product, ProductPrice } from '@prisma/client';
import { CurrentProjectSettingsQuery, PaymentMethodImportance, SubscriptionPlan, useCreateSetupIntentMutation } from 'types/gql';
import { formatCurrency } from '../../../shared/lib';
import { Box, capitalize, Divider, FormControlLabel, ListItem, ListItemIcon, ListItemText, Switch, Typography } from '@material-ui/core';
import PaymentMethodForm from './PaymentMethodForm';
import { useForm } from 'react-hook-form';
import PaymentIcon from '@material-ui/icons/Payment';
import { LoadingButton } from '@material-ui/lab';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import usePollPaymentMethods from 'hooks/usePollPaymentMethods';

type ProductNPricing = (Product & { prices: ProductPrice[] });
export type DialogChangePlanProps = {
  open: boolean;
  handleClose: () => any;
  project?: CurrentProjectSettingsQuery['currentProject'];
  products: (Product & { prices: ProductPrice[] })[];
  targetProduct?: ProductNPricing;
}

export default function DialogChangePlan({ open,  handleClose, targetProduct, project, products }: DialogChangePlanProps) {

  const { t, lang } = useTranslation();

  const loading = false;

  const stripe = useStripe();
  const elements = useElements();

  const form = useForm({ criteriaMode: 'firstError', mode: 'all' });
  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [stripeClientSecret, setStripeClientSecret] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  const [price, setPrice] = React.useState(null);
  const latestProductRef = React.useRef(null);

  const [pollPaymentMethods] = usePollPaymentMethods({
    projectId: project.id,
    paymentMethods: project.paymentMethods,
    onCompleted() {
      setProcessing(false);
      // TODO: Contiune subscription billing
    },
  })

  const [createSetupIntent, { loading: createSetupIntentLoading }] = useCreateSetupIntentMutation({
    variables: {
      projectId: project.id,
    }
  })

  React.useEffect(() => {
    if (!targetProduct) return;
    latestProductRef.current = targetProduct;
    setPrice(targetProduct?.prices[0]);
  }, [targetProduct]);

  const isMonthOrYearlyBilling = React.useMemo(() => {
    if (!targetProduct) return true;
    return targetProduct.prices.length == 2
      && targetProduct.prices.some(e => e.intervalCount == 1 && e.interval == 'month')
      && targetProduct.prices.some(e => e.intervalCount == 1 && e.interval == 'year');
  }, [targetProduct]);

  const product: ProductNPricing = targetProduct || latestProductRef.current;

  const yearlyDiscount = React.useMemo(() => {
    if (!product) return;
    if (!isMonthOrYearlyBilling) return null;
    const pm = product.prices.find(e => e.interval == 'month')
    const py = product.prices.find(e => e.interval == 'year');
    return ((1 - ((py.unitAmount / 12) / pm.unitAmount)) * 100).toFixed(1);
  }, [isMonthOrYearlyBilling, product])


  const currentPaymentMethod = project.paymentMethods.find(e => e.importance == PaymentMethodImportance.Primary);

  const interval = price && `${price.intervalCount != 1 ? price.intervalCount : ''} ${t(`pricing:${price.interval}`, { count: price.intervalCount })}`.trimStart();

  const planPricingSummary = React.useMemo(() => {
    const defaultFormat = () => {
      return t('pricing:planPricingSummary', { price: formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true }), interval });;
    }
    if (!price) return null;
    if (!isMonthOrYearlyBilling || price.interval == 'month') return defaultFormat();
    const monthlyPrice = price.unitAmount / 100 / 12;
    return `${t('pricing:planPricingSummary', { price: formatCurrency(lang, price.currency, monthlyPrice, { shortFraction: true }), interval: 'month' })} - ${t('pricing:billedYearly')}`;
  }, [interval, isMonthOrYearlyBilling, lang, price, t]);

  React.useEffect(() => {
    if (stripeClientSecret || currentPaymentMethod) return;
    if (!project) return;
    createSetupIntent()
    .then(({ data }) => {
      setStripeClientSecret(data.createSetupIntent.clientSecret);
    }).catch(err => {
      // TODO: Catch this
      console.error(err);
    })

  }, [createSetupIntent, currentPaymentMethod, project, stripeClientSecret]);


  const canSubmit = !loading && (!!currentPaymentMethod || cardComplete);

  const submit = async (data: any) => {

    const createPaymentMethod = async () => {
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
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

    if (currentPaymentMethod) {
      createPaymentMethod();
    }

    // TODO: Contiune subscription billing
  }
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: '1' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant='h6'>{project.subscriptionPlan == SubscriptionPlan.Free ? t('pricing:upgradeToPlan', { planName: product.type.toLowerCase() }) : t('pricing:changePlanTitle')}</Typography>
              <Typography color='textSecondary' variant='body2'>{t(`pricing:${product.type.toLowerCase()}_description`)}</Typography>
            </Box>

            {isMonthOrYearlyBilling &&
              <FormControlLabel
                sx={{ mb: 2 }}
                control={
                  <Switch checked={price && price.interval == 'year'} onChange={(_, c) => setPrice(product.prices.find(e => e.interval == (c ? 'year' : 'month')))} />
                }
                label={`Yealy billing (-${yearlyDiscount}%)`}
              />
            }

            <Box>
              <Typography color='textSecondary' variant='body2'>Payment Method</Typography>
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
            <Typography fontSize='0.75rem' color='textSecondary' variant='body2'>{planPricingSummary}</Typography>
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
        <Button disabled={loading} onClick={handleClose}>{t('common:close')}</Button>
        <LoadingButton loading={loading} disabled={!canSubmit} onClick={submit} variant='contained'>{t('pricing:changePlanConfirm')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}