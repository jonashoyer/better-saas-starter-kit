import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import ProductPricingsTable from 'components/layouts/ProductPricingsTable';
import { Product, ProductPrice } from '@prisma/client';
export type DialogPlanCompareProps = {
  open: boolean;
  products: (Product & { prices: ProductPrice[] })[];
  handleClose: () => any;
}

export default function DialogPlanCompare({ open, products,  handleClose }: DialogPlanCompareProps) {

  const { t } = useTranslation();


  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('common:accountSettings')}</DialogTitle>
      <DialogContent>
        <ProductPricingsTable products={products} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common:close')}</Button>
      </DialogActions>
    </Dialog>
  );
}