import React from "react";
import { Avatar, CircularProgress, Paper, PaperProps, SxProps, Theme, Typography } from "@mui/material";


interface ProjectButtonProps extends PaperProps {
  project: { id: string, name: string } | null;
  dense?: boolean;
  elevation?: number;
  endAdornment?: React.ReactNode;
  avatarSx?: SxProps<Theme>;
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

function stringAvatar(name: string, sx?: SxProps<Theme>) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      mr: 2,
      ...sx,
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] ?? ''}`.toUpperCase(),
  };
}

const ProjectButton = ({ project, dense, sx, endAdornment, avatarSx, ...rest }: ProjectButtonProps) => {
  return (
    <Paper {...rest} sx={{ display: 'flex', alignItems: 'center', px: dense ? 2 : 3, py: dense ? 1 : 2, '&:hover': { bgcolor: 'grey.300' }, transition: 'background-color 200ms ease-in-out', cursor: 'pointer', userSelect: 'none', ...sx }}>
      {!project && <CircularProgress sx={{ mx: 'auto', my: 1 }} size={24} />}
      {project &&
        <React.Fragment>
          <Avatar {...stringAvatar(project.name, avatarSx)} />
          <Typography sx={{ flex: 1 }}>{project.name}</Typography>
          {endAdornment}
        </React.Fragment>
      }
    </Paper>
  )
}

export default ProjectButton;