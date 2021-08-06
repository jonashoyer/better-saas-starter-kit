import { Button } from "@material-ui/core";
import useProject from "hooks/useProject";
import React from "react";
import ProjectButton from "../elements/ProjectButton";
import Selector from "../elements/Selector";


interface ProjectSelectorProps {
  projects: ({ id: string, name: string })[];
}

const ProjectSelector = ({ projects }: ProjectSelectorProps) => {

  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = useProject();

  const onClick = (e: { id: string }) => () => {
    setProjectId(e.id);
    setOpen(false);
  }

  return (
    <Selector
      items={[
        ...projects.map(e => <ProjectButton key={e.id} dense sx={{ width: '100%' }} elevation={0} project={e} onClick={onClick(e)} />),
        <Button key='create'>Create new project</Button>,
      ]}
      open={open}
      onClose={() => setOpen(false)}
    >
      <ProjectButton onClick={() => setOpen(true)} dense project={projects.find(e => e.id == projectId) ?? projects[0] ?? { id: 'unknown', name: 'Unknown' }} />
    </Selector>
  )
}

export default ProjectSelector;