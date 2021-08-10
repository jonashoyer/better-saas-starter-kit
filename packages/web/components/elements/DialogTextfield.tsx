import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ControllerProps, useForm, Controller, UseFormProps } from 'react-hook-form';
import { LoadingButton, LoadingButtonProps } from '@material-ui/lab';
import useTranslation from 'next-translate/useTranslation';
import FormTextField from './FormTextField';

export interface DialogTextfieldProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  initalValue?: string;
  controllerProps?: Partial<Omit<ControllerProps<{ input: string }>, 'name' | 'control'>>;
  useformProps?: UseFormProps;

  label: string;
  type?: string;

  cancelText?: string;
  submitText?: string;

  open: boolean;
  onSubmit: (input: string) => any;
  onClose?: () => any;
  loading?: boolean;
  submitButtonProps?: LoadingButtonProps;
}

export default function DialogTextfield({ title, content, initalValue, controllerProps, useformProps, label, type, cancelText, submitText, open, onSubmit, onClose, loading, submitButtonProps }: DialogTextfieldProps) {

  const { t } = useTranslation();
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm(useformProps);

  React.useEffect(() => {
    reset();
  }, [reset, open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const _onSubmit = ({ input }: any) => onSubmit(input);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <FormTextField
            label={label}
            type={type}
            autoFocus
            fullWidth
            disabled={loading}
            name='input'
            control={control}
            defaultValue={initalValue}
            controllerProps={controllerProps}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>{cancelText ?? t('common:cancel')}</Button>
        <LoadingButton {...submitButtonProps} loading={loading} disabled={!!errors.input} onClick={handleSubmit(_onSubmit)} variant='contained'>{submitText ?? t('common:submit')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}