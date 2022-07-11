import React from "react";
import { Box } from "@mui/system";
import AppFooter from "../AppFooter";
import StaticAppBar from "../AppBar/StaticAppBar";
import PrivateAppBarContent from "../AppBar/PrivateAppBarContent";
import Banner from "../Banner";
import Head from "next/head";

interface StaticPageLayoutProps {
  pageTitle: string;
  pageDescription?: string;
  children: React.ReactNode;
  padded?: boolean;
  fullWidth?: boolean;
}

const StaticPageLayout = ({ padded, children, pageTitle, pageDescription, fullWidth }: StaticPageLayoutProps) => {

  const inner = fullWidth || padded ? <Box sx={{ ...(!fullWidth && { maxWidth: 1200, mx: 'auto' }), ...(padded && { p: 2 }), minHeight: '100vh' }}> {children} </Box> : children;

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>

        <Banner />
        <StaticAppBar content={<PrivateAppBarContent />} />
        {inner}
        <AppFooter />
      </Box>
    </React.Fragment>
  )
}

export default StaticPageLayout;