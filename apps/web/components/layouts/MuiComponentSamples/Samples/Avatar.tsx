import { Avatar, AvatarGroup, Box, Theme } from "@mui/material";
import { deepOrange, deepPurple, green, pink } from "@mui/material/colors";
import React from "react";
import FolderIcon from '@mui/icons-material/Folder';
import PageviewIcon from '@mui/icons-material/Pageview';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function AvatarExample() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', m: 2, '& > *': { m: 1 } }}>
        <Avatar
          alt="Remy Sharp"
          src="https://material-ui.com/static/images/avatar/1.jpg"
        />
        <Avatar
          alt="Travis Howard"
          src="https://material-ui.com/static/images/avatar/2.jpg"
        />
        <Avatar
          alt="Cindy Baker"
          src="https://material-ui.com/static/images/avatar/3.jpg"
        />
      </Box>
      <Box sx={{ display: 'flex', m: 2, '& > *': { m: 1 } }}>
        <Avatar>H</Avatar>
        <Avatar
          sx={{
            color: (theme: Theme) => theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500]
          }}
        >
          N
        </Avatar>
        <Avatar
          sx={{
            color: (theme: Theme) => theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500]
          }}
        >
          OP
        </Avatar>
      </Box>
      <Box sx={{ display: 'flex', m: 2, '& > *': { m: 1 } }}>
        <Avatar
          alt="Remy Sharp"
          src="https://material-ui.com/static/images/avatar/1.jpg"
          sx={{ width: 24, height: 24 }}
        />
        <Avatar
          alt="Remy Sharp"
          src="https://material-ui.com/static/images/avatar/1.jpg"
        />
        <Avatar
          alt="Remy Sharp"
          src="https://material-ui.com/static/images/avatar/1.jpg"
          sx={{ width: 56, height: 56 }}
        />
      </Box>
      <Box sx={{ display: 'flex', m: 2, '& > *': { m: 1 } }}>
        <Avatar>
          <FolderIcon />
        </Avatar>
        <Avatar
          sx={{
            color: (theme: Theme) => theme.palette.getContrastText(pink[500]),
            backgroundColor: pink[500]
          }}
        >
          <PageviewIcon />
        </Avatar>
        <Avatar
          sx={{
            color: '#fff',
            backgroundColor: green[500]
          }}
        >
          <AssignmentIcon />
        </Avatar>
      </Box>
      <Box sx={{ display: 'flex', m: 2, '& > *': { m: 1 } }}>
        <AvatarGroup max={4}>
          <Avatar
            alt="Remy Sharp"
            src="https://material-ui.com/static/images/avatar/1.jpg"
          />
          <Avatar
            alt="Travis Howard"
            src="https://material-ui.com/static/images/avatar/2.jpg"
          />
          <Avatar
            alt="Cindy Baker"
            src="https://material-ui.com/static/images/avatar/3.jpg"
          />
          <Avatar
            alt="Agnes Walker"
            src="https://material-ui.com/static/images/avatar/4.jpg"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://material-ui.com/static/images/avatar/5.jpg"
          />
        </AvatarGroup>
      </Box>
    </Box>
  )
}
