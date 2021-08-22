import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import { Product, ProductPrice } from '@prisma/client';
import { CurrentProject_MembersQuery, Project } from 'types/gql';
import { formatCurrency } from '../../../shared/lib';
import { Box, DialogContentText, Typography } from '@material-ui/core';

export type DialogChangePlanProps = {
  open: boolean;
  handleClose: () => any;
  project?: CurrentProject_MembersQuery['currentProject'] | Project;
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('pricing:changePlanTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom variant='body1'>{t('pricing:changePlanContent')}</DialogContentText>
        <DialogContentText gutterBottom variant='body1'>{t('pricing:currentPlan', { plan: project.subscriptionPlan })}</DialogContentText>
        <DialogContentText gutterBottom variant='body1'>{t('pricing:billingText', { plan: type, pricing })}</DialogContentText>
        {price &&
          <React.Fragment>
            <Typography sx={{ pl: 2 }} variant='subtitle1'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })} {t('pricing:perMember')} / {price.intervalCount != 1 && price.intervalCount} {t(`pricing:${price.interval}`, { count: price.intervalCount })}</Typography>
            <Typography sx={{ pl: 2 }} variant='subtitle1'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })} x {project.users.length} {t('common:member', { count: project.users.length }).toLowerCase()} = {formatCurrency(lang, price.currency, price.unitAmount / 100 * project.users.length, { shortFraction: true })} / {price.intervalCount != 1 && price.intervalCount} {t(`pricing:${price.interval}`, { count: price.intervalCount })}</Typography>
          </React.Fragment>
        }
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>{t('common:close')}</Button>
        <Button disabled={loading} onClick={handleClose} variant='contained'>{t('pricing:changePlanConfirm')}</Button>
      </DialogActions>
    </Dialog>
  );
}