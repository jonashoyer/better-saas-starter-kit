import React from 'react';
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router'
import languageMapping from '../../utils/languageMapping.json';
import LanguageIcon from '@mui/icons-material/Language';


const LanguageSelector = () => {
  const router = useRouter();

  const handleChange = (e: SelectChangeEvent<string>) => {
    router.push(router.asPath, router.asPath, { locale: e.target.value });
  }

  return (
    <Select
      value={router.locale}
      onChange={handleChange}
      variant='standard'
      sx={{ minWidth: 120, color: '#fff', '&:after': { content: 'none'}, '&:before': { content: 'none' }, '& > svg': { display: 'none' } }}
      startAdornment={
        <InputAdornment position='start'>
          <LanguageIcon fontSize='small' sx={{ color: '#fff' }} />
        </InputAdornment>
      }
    >
      {router.locales.map(e => (
        <MenuItem key={e} value={e}>{languageMapping[e].nativeName}</MenuItem>
      ))}
    </Select>
  )
}

export default LanguageSelector;