import React from "react";
import { Link as MuiLink } from "@mui/material";
import Logo from "../elements/Logo";
import { Box } from '@mui/system';
import Copyright from "../elements/Copyright";
import NextLink from 'next/link';


const AppAppBar = (props: any) => {
  return (
    <Box
      sx={{
        px: 8,
        py: 24,
        background: '#222',
        color: '#fff',
      }}
    >
      <Box>
        <Logo />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ mr: 2 }}>
          <Copyright />
        </Box>
        {[
          ['Privacy Policy', '/privacy-policy'],
          ['Terms & Conditions', '/terms-and-conditions'],
        ].map(([label, href], index) => (
          <Box key={index} sx={{ mr: 2 }}>
            <NextLink href={href}>
              <MuiLink sx={{ color: '#fff', cursor: 'pointer' }} underline='none'>{label}</MuiLink>
            </NextLink>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default AppAppBar;