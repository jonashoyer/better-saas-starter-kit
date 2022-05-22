import React from "react";
import { Box } from "@mui/system";
import AppFooter from "../AppFooter";
import DynamicAppBar from "../AppBar/DynamicAppBar";
import PublicAppBarContent from "../AppBar/PublicAppBarContent";
import Banner from "../Banner";
import Head from "next/head";

interface DynamicPageLayoutProps {
  pageTitle: string;
  pageDescription?: string;
  children: React.ReactNode;
  padded?: boolean;
}

const DynamicPageLayout = ({ padded, children, pageTitle, pageDescription }: DynamicPageLayoutProps) => {

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
        <Box sx={{ height: 32 }} />
        <DynamicAppBar content={<PublicAppBarContent />} />
        <Box sx={{ mt: '-72px' }}>
          {inner}
        </Box>
        <AppFooter />
      </Box>
    </React.Fragment>
  )
}

export default DynamicPageLayout;