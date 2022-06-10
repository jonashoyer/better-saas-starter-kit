import { Paper, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { ProjectSettingsQuery, Project, useUpdateProjectMutation } from 'types/gql';
import { noop } from 'shared';

export interface ProjectDetailsPaperProps {
  project?: ProjectSettingsQuery['project'] | Project;
}

const ProjectDetailsPaper = ({ project }: ProjectDetailsPaperProps) => {

  const { t } = useTranslation();

  const [updateProject, { loading: updateLoading }] = useUpdateProjectMutation();

  const [name, setName] = React.useState(null);

  React.useEffect(() => {
    setName(project.name);
  }, [project]);


  const onNameSave = (e: any) => {
    e?.preventDefault?.();
    if (!name) return;
    updateProject({ variables: { input: { id: project.id, name } } });
  }

  return (
    <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

        <Typography variant='h6' gutterBottom>{t('common:project')}</Typography>

        <TextField
          size='small'
          margin='normal'
          inputProps={{ readOnly: true }}
          label={t('settings:projectId')}
          fullWidth
          value={project.id ?? ''}
          onChange={noop}
        />

        <form onSubmit={onNameSave}>
          <TextField
            margin='normal'
            label={t('settings:projectName')}
            fullWidth
            value={name ?? ''}
            onChange={e => setName(e.target.value)}
            disabled={updateLoading}
            InputProps={{
              endAdornment: (
                <LoadingButton
                  loading={updateLoading}
                  variant='outlined'
                  onClick={onNameSave}
                  disabled={name == project.name}
                >
                  {t('common:save')}
                </LoadingButton>
              )
            }}
          />
        </form>

      </Paper>
  )
}

export default ProjectDetailsPaper;