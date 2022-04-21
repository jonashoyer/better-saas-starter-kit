import React from 'react';
import DynamicPageLayout from 'components/layouts/PageLayout/DynamicPageLayout';
import { Box, FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material';
import { GetStaticProps } from 'next';
import MuiComponentSamples from '../components/layouts/MuiComponentSamples';
import { useMultiThemeContext } from './_app';

export default function Theme(props: any) {

  const { setTheme } = useMultiThemeContext();

  const theme = useTheme();

  return (
    <React.Fragment>

      <DynamicPageLayout pageTitle='Better SaaS Starter Kit'>

        <Box sx={{ pt: 14, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ flex: '0 0 180px' }} />
          <Box sx={{ maxWidth: 1000, px: 1 }}>
            <MuiComponentSamples />
          </Box>
          <Box sx={{ flex: '0 0 180px', px: 2 }}>
            <FormControl sx={{ position: 'sticky', top: 80 }} fullWidth>
              <InputLabel id="theme-select-label">Theme</InputLabel>
              <Select
                labelId="theme-select-label"
                value={(theme as any).name ?? 'default'}
                label="Theme"
                onChange={e => setTheme(e.target.value as any)}
              >
                <MenuItem value='default'>Default</MenuItem>
                <MenuItem value='berry'>Berry</MenuItem>
                <MenuItem value='materialKit'>Material Kit</MenuItem>
                <MenuItem value='softUI'>Soft UI</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

      </DynamicPageLayout>
    </React.Fragment>
  )
}


export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};