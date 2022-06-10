import React from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import Logo from "../../elements/Logo";
import { Avatar, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Link as MuiLink } from "@mui/material";
import { signIn, signOut } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import useTranslation from "next-translate/useTranslation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Lazy from "../../elements/Lazy";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useUserContext } from '../../../contexts/UserContext';

const LazyDialogAccountSettings = dynamic(() => import('../../elements/DialogAccountSettings'));

const BaseAppBarContent = () => {

  const router = useRouter();

  const { user, loading } = useUserContext();

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (e) => {
    setProfileMenuAnchorEl(e.currentTarget);
  }


  return (
    <React.Fragment>
      <Box sx={{ flexBasis: '300px', px: 2 }}>
        <Link href='/' passHref>
          <MuiLink color='inherit' underline='none'>
            <Logo />
          </MuiLink>
        </Link>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      </Box>
      <Box sx={{ flexBasis: '300px', px: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {(!loading && !user) &&
          <React.Fragment>
            <Button onClick={() => router.push('/signup')} variant='contained' color='primary'>Sign up</Button>
            <Button onClick={() => router.push('/login')} color='primary'>Login</Button>
          </React.Fragment>
        }
        {user &&
          <Button onClick={() => router.push('/dashboard')} color='primary'>Dashboard</Button>
        }
      </Box>
    </React.Fragment>
  )
}

export default BaseAppBarContent;

export interface UserMenuProps {
  anchorEl: any;
  handleClose: () => any;
}

const UserMenu = ({ anchorEl, handleClose }: UserMenuProps) => {
  const { t } = useTranslation();

  const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Lazy
        Component={LazyDialogAccountSettings}
        open={accountSettingsOpen}
        handleClose={() => setAccountSettingsOpen(false)}
      />
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setAccountSettingsOpen(true)}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          {t('common:navUserMenu.account')}
        </MenuItem>
        <Divider />
        <MenuItem sx={{ color: 'error.main' }} onClick={() => signOut({ callbackUrl: '/' })}>
          <ListItemIcon>
            <LogoutIcon color='error' fontSize="small" />
          </ListItemIcon>
          {t('common:logout')}
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}