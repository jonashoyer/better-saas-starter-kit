import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import useTranslation from 'next-translate/useTranslation';
import FormTextField from './FormTextField';
import { Box, MenuItem } from '@mui/material';
import FormSelect from './FormSelect';
import { ProjectSettingsQuery, Project, ProjectRole, useCreateManyUserInviteMutation } from 'types/gql';
import useFetchInvoices from '../../hooks/useFetchInvoices';

export interface DialogUserInviteProps {
  open: boolean;
  onClose?: () => any;
  project?: ProjectSettingsQuery['project'] | Project;
}

export default function DialogUserInvite({ open, onClose, project }: DialogUserInviteProps) {

  const { t } = useTranslation();

  const [refreshInvoices] = useFetchInvoices(project.id);

  const [createUserInvite, { loading }] = useCreateManyUserInviteMutation({
    update(cache, { data } ) {
      if (!data.createManyUserInvite) return;
      cache.modify({
        id: cache.identify(project),
        fields: {
          userInvites(existing, { toReference }) {
            return [...existing, ...data.createManyUserInvite.map(e => toReference(e))];
          }
        }
      })
    },
    onCompleted() {
      refreshInvoices();
      onClose();
    }
  });

  
  const { control, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: { emails: '', role: ProjectRole.User } });

  React.useEffect(() => {
    reset();
  }, [reset, open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const onSubmit = ({ emails, role }: any) => {
    createUserInvite({
      variables: {
        input: {
          emails: emails.split(' '),
          projectId: project!.id,
          role,
        }
      }
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('dialog:inviteMembers')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('dialog:inviteMembersContent')}</DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormTextField
            label={t('common:email', { count: 2 })}
            autoFocus
            fullWidth
            disabled={loading}
            name='emails'
            control={control}
            margin='normal'
            multiline
            minRows={2}
            type='email'
            helperText={t('dialog:inviteMembersHelperText')}
            controllerProps={{
              rules: {
                required: true,
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
        <LoadingButton loading={loading} disabled={!!errors.emails} onClick={handleSubmit(onSubmit)} variant='contained'>{t('common:invite')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}