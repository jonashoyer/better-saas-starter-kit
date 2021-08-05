import React from "react";
import { Stack } from "@material-ui/core";
import ProjectButton from "../elements/ProjectButton";


interface ProjectListProps {
  projects: ({ id: string, name: string })[];
}

const ProjectList = ({ projects }: ProjectListProps) => {

  return (
    <Stack direction='row' spacing={2}>
      {projects.map(e => {
        return (
          <ProjectButton key={e.id} project={e} />
        )
      })}
    </Stack>
  )
}

export default ProjectList;