import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ControllerProps, useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@material-ui/lab';
import useTranslation from 'next-translate/useTranslation';

export interface DialogTextfieldProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  initalValue?: string;
  controllerProps?: Partial<Omit<ControllerProps<{ input: string }>, 'name' | 'control'>>;

  label: string;
  type?: string;

  cancelText?: string;
  submitText?: string;

  open: boolean;
  onSubmit: (input: string) => any;
  onClose?: () => any;
  loading?: boolean;
}

export default function DialogTextfield({ title, content, initalValue, controllerProps, label, type, cancelText, submitText, open, onSubmit, onClose, loading }: DialogTextfieldProps) {

  const { t } = useTranslation();
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  React.useEffect(() => {
    reset();
  }, [reset, open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const hasError = !!errors.input;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        <form onSubmit={handleSubmit(handleClose)}>
          <Controller
            name='input'
            control={control}
            defaultValue={initalValue}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                autoFocus
                margin='normal'
                label={label}
                type={type}
                fullWidth
                variant='outlined'
                disabled={loading}
                error={hasError}
                helperText={error ? error.message : null}
                value={value}
                onChange={onChange}
              />
            )}
            {...controllerProps}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={hasError || loading} onClick={handleClose}>{cancelText ?? t('common:cancel')}</Button>
        <LoadingButton loading={loading} disabled={hasError} onClick={handleSubmit(({ input }) => onSubmit(input))} variant='contained'>{submitText ?? t('common:submit')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}