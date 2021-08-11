import React from 'react';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { CurrentProject_MembersQuery, Project, useDeleteUserInviteMutation, useDeleteUserProjectMutation, useCreateManyUserInviteMutation } from 'types/gql';
import useTranslation from 'next-translate/useTranslation';
import EmailIcon from '@material-ui/icons/Email';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import DialogYN from '../elements/DialogYN';
import DialogUserInvite from '../elements/DialogUserInvite';

export interface ProjectMembersPaperProps {
  project?: CurrentProject_MembersQuery['currentProject'] | Project;
}

const ProjectMembersPaper = ({ project }: ProjectMembersPaperProps) => {

  const { t } = useTranslation();

  const [deleteUserInvite, { loading: loadingDeleteUserInvite }] = useDeleteUserInviteMutation();
  const [deleteUserProject] = useDeleteUserProjectMutation();

  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  


  const [deleteInvite, setDeleteInvite] = React.useState(null);

  return (
    <React.Fragment>
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={!!userMenuAnchorEl}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={handleUserMenuClose}>
          Change role
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose} color='error'>
          Remove member
        </MenuItem>
      </Menu>
      
      <DialogYN
        open={!!deleteInvite}
        handleClose={() => setDeleteInvite(null)}
        title={t('dialog:areYouSure')}
        content={t('dialog:deleteInviteContent')}
        onSubmit={() => deleteUserInvite({ variables: { id: deleteInvite } })}
        loading={loadingDeleteUserInvite}
        submitText={t('common:remove')}
      />

      <DialogUserInvite
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
      />

      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant='h6'>{t('settings:teamMembers')}</Typography>
          <Typography variant='subtitle2' color='textSecondary'>({project?.users.length})</Typography>
        </Box>
        <List dense>
          {project?.users.map(e => (
            <ListItem
              key={e.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="more"
                  aria-controls="user-menu"
                  aria-expanded={!!userMenuAnchorEl ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleUserMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt='profile'
                  src={e.user.image}
                />
              </ListItemAvatar>
              <ListItemText primary={e.user.name ?? e.user.email} secondary={e.role} />
            </ListItem>
          ))}
          {project?.userInvites.map(e => (
            <ListItem
              key={e.id}
              secondaryAction={
                <IconButton edge="end" aria-label="cancel" onClick={() => setDeleteInvite(e.id)}>
                  <CancelIcon color='error' />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar alt='profile'>
                  <EmailIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={e.email} secondary={e.role} />
            </ListItem>
          ))}
          <ListItem button>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary='Invite new member' onClick={() => setInviteDialogOpen(true)} />
          </ListItem>
        </List>
      </Paper>
    </React.Fragment>
  )
}

export default ProjectMembersPaper;