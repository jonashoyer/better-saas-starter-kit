import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import { TextField } from '@material-ui/core';
import { useSelfQuery, useUpdateUserMutation } from 'types/gql';
import { LoadingButton } from '@material-ui/lab';

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
    setName(selfData.self?.name ?? '');
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
          id: selfData.self.id,
          name,
        }
      }
    })
  }

  const loading = selfLoading || updateUserLoading;

  return (
    <Dialog open={open} onClose={innerHandleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('common:accountSettings')}</DialogTitle>
      <DialogContent>
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
                  disabled={name == selfData.self.name}
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