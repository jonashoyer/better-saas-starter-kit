import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@material-ui/lab';
import useTranslation from 'next-translate/useTranslation';
import FormTextField from './FormTextField';
import { Box, MenuItem } from '@material-ui/core';
import FormSelect from './FormSelect';
import { ProjectRole, useCreateManyUserInviteMutation } from 'types/gql';

export interface DialogUserInviteProps {
  open: boolean;
  onClose?: () => any;
}

export default function DialogUserInvite({ open, onClose }: DialogUserInviteProps) {

  const { t } = useTranslation();

  const [createUserInvite, { loading }] = useCreateManyUserInviteMutation();

  
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  React.useEffect(() => {
    reset();
  }, [reset, open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const onSubmit = (e: any) => {
    e?.preventDefault?.();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('dialog:inviteMembers')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('dialog:inviteMembersContent')}</DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormTextField
            label={t('common:email', { count: 10 })}
            autoFocus
            fullWidth
            disabled={loading}
            name='emails'
            control={control}
            defaultValue=''
            margin='normal'
            multiline
            minRows={2}
            type='email'
            controllerProps={{
              rules: {
                pattern: {
                  value: /^(?!\ )(\ ?([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}))+$/,
                  message: "Entered value does not match email format"
                }
              }
            }}
          />
          <Box sx={{ pt: 1 }}>
            <FormSelect
              sx={{
                minWidth: 128,
              }}
              control={control}
              name='role'
              label={t('common:role')}
              defaultValue={ProjectRole.User}
              >
              {Object.entries(ProjectRole).map(([key, value]) => (
                <MenuItem key={value} value={value}>{key}</MenuItem>
                ))}
            </FormSelect>
          </Box>

        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>{t('common:cancel')}</Button>
        <LoadingButton loading={loading} disabled={!!errors.input} onClick={handleSubmit(onSubmit)} variant='contained'>{t('common:invite')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}