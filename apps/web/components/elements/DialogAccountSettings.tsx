import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import { TextField } from '@mui/material';
import { useSelfQuery, useUpdateUserMutation } from 'types/gql';
import { LoadingButton } from '@mui/lab';
import SpinnerOverlay from './SpinnerOverlay';

export type DialogAccountSettingsProps = {
  open: boolean;
  handleClose: () => any;
}

export default function DialogAccountSettings({ open,  handleClose }: DialogAccountSettingsProps) {

  const { t } = useTranslation();

  const { data: selfData, loading: selfLoading } = useSelfQuery();

  const [name, setName] = React.useState('');

  const [updateUser, { loading: updateUserLoading }] = useUpdateUserMutation();

  React.useEffect(() => {
    setName(selfData?.self?.name ?? '');
  }, [selfData]);


  const innerHandleClose = () => {
    if (loading) return;
    handleClose();
  }

  const onNameSave = (e: any) => {
    e?.preventDefault?.();
    updateUser({
      variables: {
        input: {
          id: selfData?.self.id,
          name,
        }
      }
    })
  }

  const loading = selfLoading || updateUserLoading;

  return (
    <Dialog open={open} onClose={innerHandleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('common:accountSettings')}</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        <SpinnerOverlay loading={selfLoading} />
        <DialogContentText>{}</DialogContentText>
        <form onSubmit={onNameSave}>
          <TextField
            margin='normal'
            label={t('common:name')}
            fullWidth
            value={name ?? ''}
            onChange={e => setName(e.target.value)}
            disabled={updateUserLoading}
            InputProps={{
              endAdornment: (
                <LoadingButton
                  loading={updateUserLoading}
                  variant='outlined'
                  onClick={onNameSave}
                  disabled={name == selfData?.self?.name}
                >
                  {t('common:save')}
                </LoadingButton>
              )
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={innerHandleClose}>{t('common:close')}</Button>
      </DialogActions>
    </Dialog>
  );
}