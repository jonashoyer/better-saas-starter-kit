import React from 'react'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

function Banner() {

  const { t } = useTranslation();

  return (
    <Box sx={{ background: '#000', color: '#fff', width: '100%', py: .5, display: 'flex', justifyContent: 'center' }}>
      <Typography>{t('common:banner')}</Typography>
    </Box>
  )
}

export default Banner;