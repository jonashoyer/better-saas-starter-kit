import React from 'react';
import Button from '@mui/material/Button';
import FormTextField from './FormTextField';
import { Box } from '@mui/material';
import StripeCardElement from './StripeCardElement';
import FormAutocompleteTextField from './FormAutocompleteTextField';
import countryCodes from 'utils/countryCodes.json';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';

interface PaymentMethodFormProps<TFieldValues = FieldValues>  {
  autoFocus?: boolean;
  form: UseFormReturn<TFieldValues>;
  setError: (error: any) => any;
  setCardComplete: (completed: boolean) => any;
  loading: boolean;
}

export default function PaymentMethodForm({ autoFocus, form, setError, setCardComplete, loading }: PaymentMethodFormProps) {

  const { t, lang } = useTranslation();


  const _debugFill = () => {
    navigator.clipboard.writeText('4242424242424242424242');
    form.setValue('fullName', 'Me :)')
    form.setValue('country', countryCodes[236]);
  }

  return (
    <React.Fragment>

      {true &&
        <Button onClick={_debugFill}>Fill</Button>
      }
      <StripeCardElement
        autoFocus={autoFocus}
        setError={setError}
        setCardComplete={setCardComplete}
        disabled={loading}
      />
      <Box sx={{ pt: 2 }}>
        <FormTextField
          label={t('pricing:fullName')}
          fullWidth
          size='small'
          margin='dense'
          disabled={loading}
          name='fullName'
          control={form.control}
          defaultValue=''
          controllerProps={{
            rules: {
              required: true,
              minLength: 3,
            }
          }}
        />
        <FormAutocompleteTextField
          control={form.control}
          name='country'
          options={countryCodes}
          autoHighlight
          disabled={loading}
          textFieldProps={{
            label: t('pricing:country'),
            disabled: loading,
          }}
          getOptionLabel={(option: any) => option.label}
          renderOption={(props, option: any) => (
            <Box
              component="li"
              sx={{ fontSize: 15, '& > span': { mr: '10px', fontSize: 18 } }}
              {...props}
            >
              <span>{countryToFlag(option.code)}</span> {option.label}
            </Box>
          )}
        />

      </Box>
    </React.Fragment>
  );
}

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}