import React, { FormEvent } from 'react';
import { Link as MuiLink, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { TextField } from '@mui/material';
import { useSendVerificationEmailMutation, useUpdateUserMutation } from 'types/gql';
import { LoadingButton } from '@mui/lab';
import SpinnerOverlay from './SpinnerOverlay';
import { useUserContext } from '../../contexts/UserContext';
import useCountdown from '../../hooks/useCountdown';

export type DialogAccountSettingsProps = {
  open: boolean;
  handleClose: () => any;
}

export default function DialogAccountSettings({ open,  handleClose }: DialogAccountSettingsProps) {

  const { t } = useTranslation();

  const { time: verificationCountdownTime, running: verificationCountdownRunning, start: verificationCoundownStart } = useCountdown();
  console.log({ verificationCountdownTime, verificationCountdownRunning, verificationCoundownStart });

  const { user, loading: userLoading } = useUserContext();

  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');

  const [emailLoading, setEmailLoading] = React.useState(false);
  const [nameLoading, setNameLoading] = React.useState(false);

  const [updateUser] = useUpdateUserMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();

  React.useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? '');
    setName(user.name ?? '');
  }, [user]);


  const innerHandleClose = () => {
    if (loading) return;
    handleClose();
  }

  const onNameSave = async (e: FormEvent) => {
    e?.preventDefault?.();

    try {
      setNameLoading(true);
      await updateUser({
        variables: {
          input: {
            id: user.id,
            name,
          }
        },
      })
    } catch { }
    finally {
      setNameLoading(false);
    }
  }

  const onEmailSave = async (e: FormEvent) => {
    e?.preventDefault?.();
    try {
      setEmailLoading(true);
      await updateUser({
        variables: {
          input: {
            id: user.id,
            email,
          }
        },
      });

      sendVerificationEmail();
      verificationCoundownStart(60);

    } catch { }
    finally {
      setEmailLoading(false);
    }
  }

  const resendVerificationEmail = () => {
    verificationCoundownStart(60);
    sendVerificationEmail();
  }

  const loading = userLoading || nameLoading || emailLoading;

  return (
    <Dialog open={open} onClose={innerHandleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('dialog:accountDialog.account')}</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        <SpinnerOverlay loading={userLoading} />


        <form onSubmit={onNameSave}>
          <TextField
            margin='normal'
            label={t('dialog:accountDialog.name')}
            fullWidth
            value={name ?? ''}
            onChange={e => setName(e.target.value)}
            disabled={nameLoading}
            InputProps={{
              endAdornment: (
                <LoadingButton
                  loading={nameLoading}
                  variant='outlined'
                  onClick={onNameSave}
                  disabled={!name || name == user?.name}
                >
                  {t('dialog:accountDialog.save')}
                </LoadingButton>
              )
            }}
          />
        </form>

        <form onSubmit={onEmailSave}>
          <TextField
            margin='normal'
            label={t('dialog:accountDialog.email', { count: 1 })}
            fullWidth
            value={email ?? ''}
            onChange={e => setEmail(e.target.value)}
            disabled={emailLoading}
            InputProps={{
              endAdornment: (
                <LoadingButton
                  loading={emailLoading}
                  variant='outlined'
                  onClick={onEmailSave}
                  disabled={!email || email == user?.email}
                >
                  {t('dialog:accountDialog.save')}
                </LoadingButton>
              )
            }}
            helperText={
              user.email && !user.emailVerified &&
                <Trans
                i18nKey='dialog:accountDialog.emailVerification'
                components={{ 
                  link: verificationCountdownRunning
                    ? <MuiLink underline='none' >{t('dialog:accountDialog.emailVerificationCountdown', { countdown: verificationCountdownTime })}</MuiLink>
                    : <MuiLink sx={{ cursor: 'pointer' }} onClick={resendVerificationEmail}>{t('dialog:accountDialog.emailVerificationResend')}</MuiLink>
                }}
              />
            }
          />
        </form>

      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={innerHandleClose}>{t('dialog:close')}</Button>
      </DialogActions>
    </Dialog>
  );
}