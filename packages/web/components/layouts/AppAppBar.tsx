import React from "react";
import { Box } from "@material-ui/system";
import Logo from "../elements/Logo";

const AppAppBar = (props: any) => {

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
      <Box sx={{ flex: 1, px: 2 }} />
      <Box>
        <Logo />
      </Box>
      <Box sx={{ flex: 1, px: 2 }} />
    </Box>
  )
}

export default AppAppBar;