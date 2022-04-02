import React from "react";
import { Box } from "@mui/system";
import AppFooter from "../AppFooter";
import StaticAppBar from "../AppBar/StaticAppBar";
import BaseAppBarContent from "../AppBar/BaseAppBarContent";
import Banner from "../Banner";
import Head from "next/head";

interface StaticPageLayoutProps {
  pageTitle: string;
  pageDescription?: string;
  children: React.ReactNode;
  padded?: boolean;
}

const StaticPageLayout = ({ padded, children, pageTitle, pageDescription }: StaticPageLayoutProps) => {

  const inner = padded ? <Box sx={{ p: 2, minHeight: '100vh' }}> {children} </Box> : children;

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>

        <Banner />
        <StaticAppBar content={<BaseAppBarContent />} />
        {inner}
        <AppFooter />
      </Box>
    </React.Fragment>
  )
}

export default StaticPageLayout;