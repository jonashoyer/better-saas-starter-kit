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
import { ProjectRole, UserProject, useUpdateUserProjectMutation } from 'types/gql';
import { Box, MenuItem } from '@mui/material';
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