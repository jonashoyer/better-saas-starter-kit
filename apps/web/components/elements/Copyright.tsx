import { Link } from "@mui/material";
import React from "react";



const Copyright = (props: any) => {
  return (
    <React.Fragment>
      {'© '}
      {new Date().getFullYear()},{' '}
      <Link color="inherit" underline="none">
        APP
      </Link>
    </React.Fragment>
  )
}

export default Copyright;