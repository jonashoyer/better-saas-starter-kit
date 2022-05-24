import { Button, IconButton } from "@mui/material";
import useProject from "hooks/useProject";
import React from "react";
import ProjectButton from "../elements/ProjectButton";
import Selector from "../elements/Selector";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from "next/router";
import DialogCreateProject from "../elements/DialogCreateProject";

interface ProjectSelectorProps {
  projects: ({ id: string, name: string })[] | null;
  variant?: 'text' | 'contained';
  size?: 'small' | 'medium';
}

const ProjectSelector = ({ projects, variant, size }: ProjectSelectorProps) => {

  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = useProject();

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const onClick = (e: { id: string }) => () => {
    setProjectId(e.id);
    setOpen(false);
  }

  const currentProject = React.useMemo(() => {
    if (!projects) return null;
    return projects.find(e => e.id == projectId) ?? projects[0] ?? { id: 'unknown', name: 'Unknown' };
  }, [projects, projectId]);

  const onEdit = (proj: any) => e => {
    e.stopPropagation();
    setProjectId(proj.id);
    router.push('/settings');
  }

  return (
    <React.Fragment>
      <DialogCreateProject
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
      <Selector
        items={[
          ...(projects ?? []).map(e =>
            <ProjectButton
              key={e.id}
              dense
              sx={{ width: '100%' }}
              elevation={0}
              project={e}
              onClick={onClick(e)}
              endAdornment={
                <IconButton size="small" onClick={onEdit(e)}>
                  <SettingsIcon fontSize="inherit" />
                </IconButton>
              }
            />
          ),
          <Button variant='outlined' key='create' onClick={() => setCreateDialogOpen(true)}>
            <AddIcon />
            Create new project
          </Button>,
        ]}
        open={open}
        onClose={() => setOpen(false)}
      >
        <ProjectButton
          dense
          onClick={() => setOpen(true)}
          project={currentProject}
          endAdornment={
            <KeyboardArrowDownIcon />
          }
          elevation={variant == 'text' ? 0 : 2}
          sx={{ ...(size == 'small' && { bgcolor: '#0000', '&:hover': { bgcolor: '#00000018' } }) }}
          avatarSx={{ ...(size == 'small' && { height: 26, width: 26, mr: 1, fontSize: '.85rem' }) }}
        />
      </Selector>
    </React.Fragment>
  )
}

export default ProjectSelector;