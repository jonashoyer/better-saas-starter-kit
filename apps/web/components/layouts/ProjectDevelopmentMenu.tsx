import { LoadingButton } from '@mui/lab';
import { Paper, Typography } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { ProjectSettingsQuery, Project, useSyncProjectStripeMutation } from 'types/gql';

export interface ProjectDevelopmentMenuProps {
  project?: ProjectSettingsQuery['project'] | Project;
}

const ProjectDevelopmentMenu = ({ project }: ProjectDevelopmentMenuProps) => {

  const { t } = useTranslation();

  const [syncProjectStripe, { loading }] = useSyncProjectStripeMutation({
    variables: {
      projectId: project?.id,
    },
  });

  return (
    <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

        <Typography variant='h6' gutterBottom>{t('settings:developmentMenu')}</Typography>

        <LoadingButton variant='contained' loading={loading} onClick={() => project && syncProjectStripe()}>{t('settings:syncProjectStripe')}</LoadingButton>


      </Paper>
  )
}

export default ProjectDevelopmentMenu;