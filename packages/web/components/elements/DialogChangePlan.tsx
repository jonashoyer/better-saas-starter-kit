import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import { Product, ProductPrice } from '@prisma/client';
import { CurrentProjectSettingsQuery, Project } from 'types/gql';
import { formatCurrency } from '../../../shared/lib';
import { Box, DialogContentText, Divider, Typography } from '@material-ui/core';

export type DialogChangePlanProps = {
  open: boolean;
  handleClose: () => any;
  project?: CurrentProjectSettingsQuery['currentProject'] | Project;
  products: (Product & { prices: ProductPrice[] })[];
  targetProduct?: (Product & { prices: ProductPrice[] });
}

export default function DialogChangePlan({ open,  handleClose, targetProduct, project, products }: DialogChangePlanProps) {

  const { t, lang } = useTranslation();

  const loading = false;

  const [type, setType] = React.useState(null);
  const [price, setPrice] = React.useState(null);

  React.useEffect(() => {
    if (!targetProduct) return;
    setType(targetProduct?.type);
    setPrice(targetProduct?.prices[0]);
  }, [targetProduct]);

  const pricing = price && `${formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })} ${t('pricing:perMember')} / ${price.intervalCount != 1 && price.intervalCount} ${t(`pricing:${price.interval}`, { count: price.intervalCount })}`;
  const interval = `${price.intervalCount != 1 ? price.intervalCount : ''} ${t(`pricing:${price.interval}`, { count: price.intervalCount })}`.trimStart();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('pricing:changePlanTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{  px: .5 }}>

            <DialogContentText gutterBottom variant='body1'>{t('pricing:changePlanContent')}</DialogContentText>
            <DialogContentText gutterBottom variant='body1'>{t('pricing:currentPlan', { plan: project.subscriptionPlan })}</DialogContentText>
            <DialogContentText gutterBottom variant='body1'>{t('pricing:billingText', { plan: type, pricing })}</DialogContentText>
          </Box>
          <Box sx={{ flex: '1', px: .5 }}>
            <Typography gutterBottom>Plan summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='text' variant='body2'>BASIC plan ({project.users.length} {t('common:member', { count: project.users.length }).toLowerCase()})</Typography>
              <Typography fontSize='0.875rem' variant='body1'>{formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
            </Box>
            <Typography fontSize='0.75rem' color='textSecondary' variant='body2'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })} / member / {interval}</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='textSecondary' variant='body2'>Subtotal</Typography>
              <Typography fontSize='0.75rem' variant='body1'>{formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='textSecondary' variant='body2'>Tax</Typography>
              <Typography fontSize='0.75rem' variant='body1'>-</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color='textSecondary' variant='body2'>Total</Typography>
              <Typography fontSize='1.15rem' variant='body1'>{formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>{t('common:close')}</Button>
        <Button disabled={loading} onClick={handleClose} variant='contained'>{t('pricing:changePlanConfirm')}</Button>
      </DialogActions>
    </Dialog>
  );
}