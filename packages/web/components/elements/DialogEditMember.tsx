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
import { ProjectRole, UserProject, useUpdateUserProjectMutation } from 'types/gql';
import { Box, MenuItem } from '@material-ui/core';
import FormSelect from './FormSelect';

export interface DialogEditMemberProps {
  open: boolean;
  onClose: () => any;
  userProject: UserProject;
}

export default function DialogEditMember({ open, onClose, userProject }: DialogEditMemberProps) {

  const { t } = useTranslation();

  const [updateUserProject, { loading }] = useUpdateUserProjectMutation({
    onCompleted() {
      onClose();
    }
  });
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  React.useEffect(() => {
    if (!open) return;
    reset({
      role: userProject.role,
    });
  }, [reset, open, userProject]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const onUpdate = ({ role }: { role: ProjectRole }) => {
    updateUserProject({
      variables: {
        input: {
          id: userProject.id,
          role,
        }
      }
    })
  }

  const hasError = !!errors.input;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('dialog:editMemberTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('dialog:editMemberContent')}</DialogContentText>
        <form onSubmit={handleSubmit(onUpdate)}>
          <Box sx={{ pt: 2 }}>
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
        <LoadingButton loading={loading} disabled={hasError} onClick={handleSubmit(onUpdate)} variant='contained'>{t('common:update')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}