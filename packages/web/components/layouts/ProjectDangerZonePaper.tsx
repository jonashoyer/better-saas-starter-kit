import useProject from '@/hooks/useProject';
import dynamic from 'next/dynamic';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React from 'react';
import { CurrentProject_MembersQuery, Project, useDeleteProjectMutation } from 'types/gql';
import Lazy from '../elements/Lazy';

const LazyDialogTextfield = dynamic(() => import('../elements/DialogTextfield'));

export interface ProjectDangerZonePaperProps {
  project?: CurrentProject_MembersQuery['currentProject'] | Project;
}

const ProjectDangerZonePaper = ({ project }: ProjectDangerZonePaperProps) => {

  const router = useRouter();
  const { t } = useTranslation();

  const [, setProject] = useProject();

  const [deleteProject, { loading: deleteLoading }] = useDeleteProjectMutation({
    onCompleted() {
      setProject(null);
      router.push('/');
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const onDelete = () => {
    deleteProject({ variables: { id: project.id } });
  }

  return (
    <React.Fragment>

      <Lazy
        Component={LazyDialogTextfield}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        loading={deleteLoading}
        controllerProps={{
          rules: {
            validate: input => input == project?.name
          }
        }}
        useformProps={{ mode: 'all' }}
        label={t('settings:projectName')}
        title={t('settings:deleteProject')}
        content={t('settings:deleteProjectContent', { projectName: project?.name })}
        onSubmit={onDelete}
        submitText='Delete'
        submitButtonProps={{
          color: 'error',
        }}
      />

      <Paper sx={{ p: 3, maxWidth: 768, margin: 'auto', borderWidth: 1, borderStyle: 'solid', borderColor: t => t.palette.error.main }} elevation={0}>
        <Typography variant='h6' color='error' gutterBottom>{t('settings:dangerZone')}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='subtitle1'>Delete this project</Typography>
            <Typography variant='body2'>Delete this project</Typography>
          </Box>
          <Box>
            <Button variant='contained' color='error' onClick={() => setDeleteDialogOpen(true)}>{t('settings:deleteThisProject')}</Button>
          </Box>
        </Box>
      </Paper>
    </React.Fragment>
  )
}

export default ProjectDangerZonePaper;