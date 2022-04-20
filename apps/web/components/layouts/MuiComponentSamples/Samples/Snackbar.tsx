import React from "react"
import Button from "@mui/material/Button"
import { Theme } from "@mui/material/styles"
import SnackbarContent from "@mui/material/SnackbarContent"
import { Box, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

const action = (
  <Button color="secondary" size="small">
    lorem ipsum dolorem
  </Button>
)

export default function SnackbarExample() {
  return (
    <Box sx={{ maxWidth: 600, '& > * + *': { mt: 2 } }}>
      <SnackbarContent message="I love snacks." action={action} />
      <SnackbarContent
        message={
          "I love candy. I love cookies. I love cupcakes. \
          I love cheesecake. I love chocolate."
        }
        action={
          <IconButton size="small" aria-label="close" color="inherit">
            <CloseIcon />
          </IconButton>
        }
      />
      <SnackbarContent
        message="I love candy. I love cookies. I love cupcakes."
        action={action}
      />
      <SnackbarContent
        message={
          "I love candy. I love cookies. I love cupcakes. \
          I love cheesecake. I love chocolate."
        }
        action={action}
      />
    </Box>
  )
}
