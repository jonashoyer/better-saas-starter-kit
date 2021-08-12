import React from 'react';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { CurrentProject_MembersQuery, Project, useDeleteUserInviteMutation, useDeleteUserProjectMutation, useCreateManyUserInviteMutation, User, SelfQuery } from 'types/gql';
import useTranslation from 'next-translate/useTranslation';
import EmailIcon from '@material-ui/icons/Email';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import DialogYN from '../elements/DialogYN';
import DialogUserInvite from '../elements/DialogUserInvite';
import DialogEditMember from '../elements/DialogEditMember';

export interface ProjectMembersPaperProps {
  project?: CurrentProject_MembersQuery['currentProject'] | Project;
  self?: SelfQuery['self'] | User;
}

const ProjectMembersPaper = ({ project, self }: ProjectMembersPaperProps) => {

  const { t } = useTranslation();

  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const [userMenuUserProject, setUserMenuUserProject] = React.useState(null);
  const [deleteInvite, setDeleteInvite] = React.useState(null);
  const [deleteUserProjectId, setDeleteUserProjectId] = React.useState(null);
  const [editUserProject, setEditUserProject] = React.useState(null);


  const [deleteUserInvite, { loading: loadingDeleteUserInvite }] = useDeleteUserInviteMutation({
    update(cache, { data }) {
      if (!data.deleteUserInvite) return;
      cache.modify({
        id: cache.identify(project),
        fields: {
          userInvites(existing, { toReference }) {
            const ref = toReference(data.deleteUserInvite);
            return existing.filter((e: any) => e.__ref !== ref.__ref);
          }
        }
      })
    },
    onCompleted() {
      setDeleteInvite(null);
    }
  });
  const [deleteUserProject, { loading: loadingDeleteUserProject }] = useDeleteUserProjectMutation({
    update(cache, { data }) {
      if (!data.deleteUserProject) return;
      cache.modify({
        id: cache.identify(project),
        fields: {
          users(existing, { toReference }) {
            const ref = toReference(data.deleteUserProject);
            return existing.filter((e: any) => e.__ref !== ref.__ref);
          }
        }
      })
    },
    onCompleted() {
      setDeleteUserProjectId(null);
    }
  });


  const handleUserMenuClick = (userProject: any) => (event: any) => {
    setUserMenuAnchorEl(event.currentTarget);
    setUserMenuUserProject(userProject);
  };
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
    setUserMenuUserProject(null);
  };

  const handleEditMember = () => {
    setEditUserProject(userMenuUserProject);
    handleUserMenuClose();
  }

  const handleRemoveMember = () => {
    setDeleteUserProjectId(userMenuUserProject.id);
    handleUserMenuClose();
  }
  

  return (
    <React.Fragment>
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={!!userMenuAnchorEl}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={handleEditMember}>
          Edit member
        </MenuItem>
        <MenuItem onClick={handleRemoveMember}>
          Remove member
        </MenuItem>
      </Menu>
      
      <DialogYN
        open={!!deleteInvite}
        maxWidth='xs'
        handleClose={() => setDeleteInvite(null)}
        title={t('dialog:deleteInviteTitle')}
        content={t('dialog:deleteInviteContent')}
        onSubmit={() => deleteUserInvite({ variables: { id: deleteInvite } })}
        loading={loadingDeleteUserInvite}
        submitText={t('common:remove')}
      />

      <DialogYN
        open={!!deleteUserProjectId}
        maxWidth='xs'
        handleClose={() => setDeleteUserProjectId(null)}
        title={t('dialog:deleteUserProjectTitle')}
        content={t('dialog:deleteUserProjectContent')}
        onSubmit={() => deleteUserProject({ variables: { id: deleteUserProjectId } })}
        loading={loadingDeleteUserProject}
        submitText={t('common:remove')}
      />

      <DialogUserInvite
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        project={project}
      />

      <DialogEditMember
        open={!!editUserProject}
        userProject={editUserProject}
        onClose={() => setEditUserProject(null)}
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
                self.id !== e.user.id
                && <IconButton
                  edge="end"
                  aria-label="more"
                  aria-controls="user-menu"
                  aria-expanded={!!userMenuAnchorEl ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleUserMenuClick(e)}
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