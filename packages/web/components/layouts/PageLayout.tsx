import React from "react";
import { Box } from "@mui/system";
import AppFooter from "./AppFooter";
import AppAppBar from "./AppAppBar";
import Banner from "./Banner";

interface PageLayoutProps {
  children: React.ReactNode;
  padded?: boolean;
}

const PageLayout = ({ padded, children }: PageLayoutProps) => {

  const inner = padded ? <Box sx={{ p: 2, minHeight: '100vh' }}> {children} </Box> : children;

  return (
    <Box>
      <Banner />
      <AppAppBar />
      {inner}
      <AppFooter />
    </Box>
  )
}

export default PageLayout;