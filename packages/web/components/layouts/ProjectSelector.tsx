import { Button } from "@material-ui/core";
import React from "react";
import ProjectButton from "../elements/ProjectButton";
import Selector from "../elements/Selector";


interface ProjectSelectorProps {
  projects: ({ id: string, name: string })[];
  currentProject: { id: string, name: string };
}

const ProjectSelector = ({ projects, currentProject }: ProjectSelectorProps) => {

  const [open, setOpen] = React.useState(false);

  return (
    <Selector
      items={[
        ...projects.map(e => <ProjectButton key={e.id} dense sx={{ width: '100%' }} elevation={0} project={e} />),
        <Button key='create' variant='contained' size='large'>Create new project</Button>,
      ]}
      open={open}
      onClose={() => setOpen(false)}
    >
      <ProjectButton onClick={() => setOpen(true)} dense project={currentProject} />
    </Selector>
  )
}

export default ProjectSelector;