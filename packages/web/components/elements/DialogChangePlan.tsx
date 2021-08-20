import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';

export type DialogChangePlanProps = {
  open: boolean;
  handleClose: () => any;
}

export default function DialogChangePlan({ open,  handleClose }: DialogChangePlanProps) {

  const { t } = useTranslation();

  const loading = false;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('dialog:changePlanTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('dialog:changePlanContent')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>{t('common:close')}</Button>
        <Button disabled={loading} onClick={handleClose}>{t('dialog:changePlanConfirm')}</Button>
      </DialogActions>
    </Dialog>
  );
}