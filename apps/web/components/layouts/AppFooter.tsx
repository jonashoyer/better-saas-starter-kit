import React from "react";
import { Link as MuiLink, Typography } from "@mui/material";
import Logo from "../elements/Logo";
import { Box } from '@mui/system';
import Copyright from "../elements/Copyright";
import NextLink from 'next/link';
import LanguageSelector from './LanguageSelector';


const AppAppBar = (props: any) => {
  return (
    <Box
      sx={{
        px: 8,
        py: 12,
        pb: 2,
        background: '#222',
        color: '#fff',
      }}
    >
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 1 }}>
          <Logo />
        </Box>
        <LanguageSelector />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" sx={{ color: '#fffa' }}>
          <Copyright />
        </Typography>
        {[
          ['Privacy Policy', '/privacy-policy'],
          ['Terms & Conditions', '/terms-and-conditions'],
        ].map(([label, href], index) => (
          <NextLink key={index} href={href}>
            <MuiLink variant='body2' sx={{ color: '#fffa', cursor: 'pointer' }} underline='none'>{label}</MuiLink>
          </NextLink>
        ))}
      </Box>
    </Box>
  )
}

export default AppAppBar;