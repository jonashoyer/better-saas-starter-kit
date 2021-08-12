import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { LoadingButton } from '@material-ui/lab';
import useTranslation from 'next-translate/useTranslation';
import { DialogProps } from '@material-ui/core';

export type DialogYNProps = DialogProps & {
  open: boolean;
  onSubmit: () => any;
  handleClose: () => any;
  loading?: boolean;

  title: React.ReactNode;
  content?: React.ReactNode;

  cancelText?: string;
  submitText?: string;
}

export default function DialogYN({ open, title, content, cancelText, submitText, loading, onSubmit, handleClose, ...dialogProps }: DialogYNProps) {

  const { t } = useTranslation();

  const onClose = () => {
    if (loading) return;
    handleClose();
  }

  return (
    <Dialog {...dialogProps} open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose}>{cancelText ?? t('common:cancel')}</Button>
        <LoadingButton variant='contained' loading={loading} onClick={onSubmit}>{submitText ?? t('common:submit')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}