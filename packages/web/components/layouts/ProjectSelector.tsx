import { Button, IconButton } from "@material-ui/core";
import useProject from "hooks/useProject";
import React from "react";
import ProjectButton from "../elements/ProjectButton";
import Selector from "../elements/Selector";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

interface ProjectSelectorProps {
  projects: ({ id: string, name: string })[];
  onProjectEdit: (project: { id: string, name: string }) => any;
}

const ProjectSelector = ({ projects, onProjectEdit }: ProjectSelectorProps) => {

  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = useProject();

  const onClick = (e: { id: string }) => () => {
    setProjectId(e.id);
    setOpen(false);
  }

  const currentProject = React.useMemo(() => {
    return projects.find(e => e.id == projectId) ?? projects[0] ?? { id: 'unknown', name: 'Unknown' };
  }, [projects, projectId]);

  const onEdit = (proj: any) => e => {
    e.stopPropagation();
    onProjectEdit(proj);
    setOpen(false);
  }

  return (    
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
        <Button variant='outlined' key='create'>
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
  )
}

export default ProjectSelector;