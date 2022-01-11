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
import { useCreateProjectMutation } from 'types/gql';
import useProject from 'hooks/useProject';
import { useRouter } from 'next/router';

export interface DialogCreateProjectProps {
  open: boolean;
  onClose: () => any;
}

export default function DialogCreateProject({ open, onClose }: DialogCreateProjectProps) {

  const router = useRouter();
  const { t } = useTranslation();
  const [, setProject] = useProject();


  const [createProject, { loading }] = useCreateProjectMutation({
    onCompleted({ createProject }) {
      setProject(createProject.id);
      router.push('/');
      onClose();
    }
  });
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  React.useEffect(() => {
    reset();
  }, [reset, open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const onCreate = ({ name }: { name: string }) => {
    createProject({
      variables: {
        input: {
          name,
        }
      }
    })
  }

  const hasError = !!errors.input;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('dialog:createNewProject')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('dialog:createNewProjectContent')}</DialogContentText>
        <form onSubmit={handleSubmit(onCreate)}>
          <FormTextField
            autoFocus
            name='name'
            control={control}
            fullWidth
            
            label={t('common:name')}
            disabled={loading}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>{t('common:cancel')}</Button>
        <LoadingButton loading={loading} disabled={hasError} onClick={handleSubmit(onCreate)} variant='contained'>{t('common:create')}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}