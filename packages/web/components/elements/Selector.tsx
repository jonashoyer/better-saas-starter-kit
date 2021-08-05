import React from "react";
import { Box, Stack, ClickAwayListener, Paper } from "@material-ui/core";


export interface SelectorProps {
  children: React.ReactNode;
  items: React.ReactNode[];
  open: boolean;
  onClose: () => any;
}

const Selector = ({ children, items, open, onClose }: SelectorProps) => {
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box sx={{ position: 'relative', maxWidth: 288 }}>
        {children}
        <Paper sx={{ p: 1, position: 'absolute', top: 0, left: 0, display: open ? 'block' : 'none', minWidth: 288 }}>
          <Stack direction='column' spacing={1}>
            {items}
          </Stack>
        </Paper>
      </Box>
    </ClickAwayListener>
  )
}

export default Selector;