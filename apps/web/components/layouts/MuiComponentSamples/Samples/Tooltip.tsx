import React from "react"
import { makeStyles, Theme, createStyles } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import Fab from "@mui/material/Fab"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

export default function TooltipExample() {

  return (
    <div>
      <Tooltip title="Delete">
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add" aria-label="add">
        <Fab color="primary" sx={{ m: 2 }}>
          <AddIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Add" aria-label="add">
        <Fab color="secondary" sx={{ m: 2 }}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  )
}
