import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import ProductPricingsTable, { ProductPricingsLayoutProps } from 'components/layouts/ProductPricingsTable';

export type DialogPlanCompareProps = ProductPricingsLayoutProps & {
  open: boolean;
  handleClose: () => any;
}

export default function DialogPlanCompare({ open, handleClose, onPlanSwitch, ...rest }: DialogPlanCompareProps) {

  const { t } = useTranslation();

  const onPlanSwitchProxy = onPlanSwitch
    ? (e: any) => {
      handleClose();
      onPlanSwitch(e);
    } : undefined;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>{t('pricing:planSummary')}</DialogTitle>
      <DialogContent>
        <ProductPricingsTable {...rest} onPlanSwitch={onPlanSwitchProxy} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common:close')}</Button>
      </DialogActions>
    </Dialog>
  );
}