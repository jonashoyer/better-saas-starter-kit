import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import useTranslation from 'next-translate/useTranslation';
import { DialogProps } from '@mui/material';

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