import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useTranslation from 'next-translate/useTranslation';
import { ProjectSettingsQuery, StripePrice } from 'types/gql';
import { formatCurrency } from 'shared';
import { Box, Divider, Typography } from '@mui/material';
import usePaymentMethodSelection from '../../hooks/usePaymentMethodSelection';
import { LoadingButton } from '@mui/lab';

export type DialogPurchaseProps = {
  open: boolean;
  handleClose: () => any;
  project?: ProjectSettingsQuery['project'];
  targetProductPrice?: StripePrice;
}

export default function DialogPurchase({ open,  handleClose, targetProductPrice, project }: DialogPurchaseProps) {

  const { t, lang } = useTranslation();
  
  const { Form, reset, submitPaymentMethod, cardComplete, loading: paymenthMethodLoading } = usePaymentMethodSelection({
    project,
    async onPaymentMethodAdded() {

      // TODO: Do purchases

    }
  });

  const currentPaymentMethod = project.stripePaymentMethods.find(e => e.isDefault) ?? project.stripePaymentMethods[0] ?? null;



  React.useEffect(() => {
    if (!open) return;
    reset();
  }, [reset, open])

  const handleChangePlan = async (data: any) => {

    if (!currentPaymentMethod) {
      return submitPaymentMethod();
    }

    // TODO: Poll and confirm purchases

  }

  const loading = paymenthMethodLoading;
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
              <Typography variant='h6'>{t('pricing:purchaseProduct', { productName: targetProductPrice?.stripeProduct.name })}</Typography>
              <Typography color='textSecondary' variant='body2'>{t('pricing:purchaseContent', { productName: targetProductPrice?.stripeProduct.name, amount: targetProductPrice && formatCurrency(lang, targetProductPrice.currency, targetProductPrice.unitAmount / 100, { shortFraction: true }) })}</Typography>
            </Box>

            <Form />
          </Box>

            <Divider flexItem variant='middle' orientation='vertical' />
            <Box sx={{ flex: '0 0 220px' }}>
              <Typography sx={{ mb: 3 }} fontSize={16} variant='h6'>{t('pricing:planSummary')}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color='text' variant='body2'>{targetProductPrice?.stripeProduct.name}</Typography>
                <Typography fontSize='0.875rem' variant='body1'>{targetProductPrice && formatCurrency(lang, targetProductPrice.currency, targetProductPrice.unitAmount / 100, { shortFraction: true })}</Typography>
              </Box>
              <Typography fontSize='0.725rem' color='textSecondary' variant='body2'>{t(`pricing:${targetProductPrice?.stripeProduct.metadata.key?.toLowerCase()}Description`)}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color='textSecondary' variant='body2'>{t('pricing:subtotal')}</Typography>
                <Typography fontSize='0.75rem' variant='body1'>{targetProductPrice && formatCurrency(lang, targetProductPrice.currency, targetProductPrice.unitAmount / 100, { shortFraction: true })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color='textSecondary' variant='body2'>{t('pricing:tax')}</Typography>
                <Typography fontSize='0.75rem' variant='body1'>-</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color='textSecondary' variant='body2'>{t('pricing:total')}</Typography>
                <Typography fontSize='1.15rem' variant='body1'>{targetProductPrice && formatCurrency(lang, targetProductPrice.currency, targetProductPrice.unitAmount / 100, { shortFraction: true })}</Typography>
              </Box>
            </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleCloseProxy}>{t('common:close')}</Button>
        <LoadingButton loading={loading} disabled={!canSubmit} onClick={handleChangePlan} variant='contained'>{t('pricing:purchaseConfirm', { amount: targetProductPrice && formatCurrency(lang, targetProductPrice.currency, targetProductPrice.unitAmount / 100, { shortFraction: true }) })}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}