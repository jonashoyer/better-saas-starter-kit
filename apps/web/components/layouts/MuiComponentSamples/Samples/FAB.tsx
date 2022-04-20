import React from "react"
import { createStyles, makeStyles, Theme } from "@mui/material/styles"
import Fab from "@mui/material/Fab"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import FavoriteIcon from "@mui/icons-material/Favorite"
import NavigationIcon from "@mui/icons-material/Navigation"
import { Box } from "@mui/material"

export default function FabExample() {
  return (
    <Box sx={{ '& > *': { m: 1 } }}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="edit">
        <EditIcon />
      </Fab>
      <Fab variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
      </Fab>
      <Fab disabled aria-label="like">
        <FavoriteIcon />
      </Fab>
    </Box>
  )
}
