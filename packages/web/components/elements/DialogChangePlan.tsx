import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import { Product, ProductPrice } from '@prisma/client';
import { CurrentProjectSettingsQuery, PaymentMethodImportance } from 'types/gql';
import { formatCurrency } from '../../../shared/lib';
import { Box, capitalize, Divider, FormControlLabel, ListItem, ListItemIcon, ListItemText, Switch, Typography } from '@material-ui/core';
import PaymentMethodForm from './PaymentMethodForm';
import { useForm } from 'react-hook-form';
import PaymentIcon from '@material-ui/icons/Payment';
import { LoadingButton } from '@material-ui/lab';


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

  const form = useForm({ criteriaMode: 'firstError', mode: 'all' });
  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);

  const [price, setPrice] = React.useState(null);
  const latestProductRef = React.useRef(null);

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


  const canSubmit = !loading && (!!currentPaymentMethod || cardComplete);
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('pricing:changePlanTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{  }}>
            {isMonthOrYearlyBilling &&
              <FormControlLabel
                control={
                  <Switch checked={price && price.interval == 'year'} onChange={(_, c) => setPrice(product.prices.find(e => e.interval == (c ? 'year' : 'month')))} />
                }
                label={`Yealy billing (-${yearlyDiscount}%)`}
              />
            }
{/* 
            <DialogContentText gutterBottom variant='body1'>{t('pricing:changePlanContent')}</DialogContentText>
            <DialogContentText gutterBottom variant='body1'>{t('pricing:currentPlan', { plan: project.subscriptionPlan })}</DialogContentText>
            <DialogContentText gutterBottom variant='body1'>{t('pricing:billingText', { plan: type, pricing })}</DialogContentText>
             */}
            {currentPaymentMethod &&
              <Box>
                <Typography color='textSecondary' variant='body2'>Payment Method</Typography>
                <ListItem dense>
                  <ListItemIcon>
                    <PaymentIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary={`${capitalize(currentPaymentMethod.brand)} •••• ${currentPaymentMethod.last4}`} secondary={`${t('pricing:expires')} ${currentPaymentMethod.expMonth}/${currentPaymentMethod.expYear}`} />
                </ListItem>
              </Box>
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
          <Box sx={{ flex: '1' }}>
            <Typography gutterBottom>{t('pricing:planSummary')}</Typography>
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
        <LoadingButton loading={loading} disabled={canSubmit} onClick={handleClose} variant='contained'>{t('pricing:changePlanConfirm')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}