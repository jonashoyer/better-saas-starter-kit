import React from "react";
import dynamic from 'next/dynamic';
import { Box } from "@mui/system";
import Logo from "../elements/Logo";
import { Avatar, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { signIn, useSession } from "next-auth/client";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/client"
import useTranslation from "next-translate/useTranslation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Lazy from "../elements/Lazy";

const LazyDialogAccountSettings = dynamic(() => import('../elements/DialogAccountSettings'));


const AppAppBar = (props: any) => {

  const [session, loading] = useSession();

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (e) => {
    setProfileMenuAnchorEl(e.currentTarget);
  }

  return (
    <Box
      sx={{
        position: 'sticky',
        left: 64,
        right: 64,
        top: 0,
        background: '#ffffff44',
        px: 2,
        py: 3,
        color: '#000',
        justifyContent: 'center',
        display: 'flex',
        backdropFilter: 'saturate(180%) blur(5px)',
        zIndex: (theme: any) => theme.zIndex.appBar,
        borderBottom: '1px solid #00000044',
      }}
    >
      <Box sx={{ flexBasis: '200px', px: 2 }} />
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Logo />
      </Box>
      <Box sx={{ flexBasis: '200px', px: 2, display: 'flex', justifyContent: 'flex-end' }}>
        {(!loading && session) &&
          <React.Fragment>
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt='profile'
                src={session?.user.image}
              />
            </IconButton>
            <UserMenu
              anchorEl={profileMenuAnchorEl}
              handleClose={() => setProfileMenuAnchorEl(null)}
            />
          </React.Fragment>
        }
        {(!loading && !session) &&
          <Button onClick={() => signIn()} variant='contained' color='primary'>Login</Button>
        }
      </Box>
    </Box>
  )
}

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
          {t('common:accountSettings')}
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

export default AppAppBar;