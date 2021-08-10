import { Button, IconButton } from "@material-ui/core";
import useProject from "hooks/useProject";
import React from "react";
import ProjectButton from "../elements/ProjectButton";
import Selector from "../elements/Selector";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import { useRouter } from "next/router";
import CreateProjectDialog from "../elements/CreateProjectDialog";

interface ProjectSelectorProps {
  projects: ({ id: string, name: string })[];
}

const ProjectSelector = ({ projects }: ProjectSelectorProps) => {

  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = useProject();

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const onClick = (e: { id: string }) => () => {
    setProjectId(e.id);
    setOpen(false);
  }

  const currentProject = React.useMemo(() => {
    return projects.find(e => e.id == projectId) ?? projects[0] ?? { id: 'unknown', name: 'Unknown' };
  }, [projects, projectId]);

  const onEdit = (proj: any) => e => {
    e.stopPropagation();
    setProjectId(proj.id);
    router.push('/settings');
  }

  return (
    <React.Fragment>
      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
      <Selector
        items={[
          ...projects.map(e =>
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
        />
      </Selector>
    </React.Fragment>
  )
}

export default ProjectSelector;