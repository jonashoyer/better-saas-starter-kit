import React from "react";
import { Avatar, Paper, PaperProps, Typography } from "@mui/material";


interface ProjectButtonProps extends PaperProps {
  project: { id: string, name: string };
  dense?: boolean;
  elevation?: number;
  endAdornment?: React.ReactNode;
  test?: any;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      mr: 2,
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] ?? ''}`.toUpperCase(),
  };
}

const ProjectButton = ({ project, dense, sx, endAdornment, ...rest }: ProjectButtonProps) => {
  return (
    <Paper {...rest} sx={{ display: 'flex', alignItems: 'center', px: dense ? 2 : 3, py: dense ? 1 : 2, '&:hover': { bgcolor: 'grey.300' }, transition: 'background-color 200ms ease-in-out', cursor: 'pointer', ...sx }}>
      <Avatar {...stringAvatar(project.name)} />
      <Typography sx={{ flex: 1 }}>{project.name}</Typography>
      {endAdornment}
    </Paper>
  )
}

export default ProjectButton;