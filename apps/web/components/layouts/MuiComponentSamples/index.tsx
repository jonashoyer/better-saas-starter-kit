import React from "react";
import { Typography, Button, Grid, Box } from "@mui/material";

import componentSamples from "./Samples";

const MuiComponentSamples = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Material-UI Components
      </Typography>
      {componentSamples.map(({ id, title, component, docs }) => (
        <div key={id} id={id}>
          <Grid sx={{ mb: 1 }} container justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              href={docs}
              target="_blank"
              rel="noreferrer"
            >
              Docs
            </Button>
          </Grid>
          <Box sx={{ mb: 10, width: '100%', pl: 4, mx: 'auto' }}>{component}</Box>
        </div>
      ))}
    </Box>
  )
}

export default MuiComponentSamples