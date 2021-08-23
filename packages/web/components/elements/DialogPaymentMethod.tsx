import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreateSetupIntentMutation } from 'types/gql';
import useProject from 'hooks/useProject';
import FormTextField from './FormTextField';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';
import StripeCardElement from './StripeCardElement';
import FormAutocompleteTextField from './FormAutocompleteTextField';

export type DialogPaymentMethodProps = {
  open: boolean;
  handleClose: () => any;
}

// https://stripe.com/docs/stripe-js/react
// https://codesandbox.io/s/react-stripe-js-card-detailed-omfb3?file=/src/App.js
// https://github.com/stripe-samples/subscription-use-cases

export default function DialogPaymentMethod({ open,  handleClose }: DialogPaymentMethodProps) {

  const { t, lang } = useTranslation();

  const [countryCodes, setCountryCodes] = React.useState(null);

  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm({ criteriaMode: 'firstError', mode: 'all' });
  
  React.useEffect(() => {
    if (!open) {
      setCountryCodes(null);
      return;
    }
    reset();
    import('utils/countryCodes.json').then(codes =>
      setCountryCodes(
        Object.entries(codes).map(([code, label]) => ({ code, label }))
        )
      );

  }, [reset, open]);

  const [projectId] = useProject();

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = React.useState(null);

  const [createSetupIntent, { called, loading: createSetupIntentLoading }] = useCreateSetupIntentMutation({
    variables: {
      projectId,
    }
  })

  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    if (called) return;
    createSetupIntent().then(({ data }) => {
      setClientSecret(data.createSetupIntent.clientSecret);
    }).catch(err => {
      // TODO: Catch this
      console.error(err);
    })

  }, [createSetupIntent, called]);

  const confirmCardSetup = async (data) => {

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement("card").focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }


    const payload = await stripe.confirmCardSetup(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            address: {
              country: data.country,
            },
            name: data.fullName,
          },
        },
      }
    )
    
    setProcessing(false);

    if (payload.error) {
      console.log('[error]', payload.error);
      setError(payload.error);
      return;
    }

    console.log('[PaymentMethod]', payload.setupIntent);
  };

  console.log(countryCodes);

  const loading = processing || createSetupIntentLoading;  

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('settings:addPaymentMethod')}</DialogTitle>
      <form onSubmit={handleSubmit(confirmCardSetup)}>
        <DialogContent>
          <StripeCardElement
            setError={setError}
            setCardComplete={setCardComplete}
          />
          <Box sx={{ pt: 2 }}>
            <FormTextField
              label={t('pricing:fullName')}
              autoFocus
              fullWidth
              size='small'
              margin='dense'
              disabled={loading}
              name='fullName'
              control={control}
              defaultValue=''
              controllerProps={{
                rules: {
                  required: true,
                  minLength: 3,
                }
              }}
            />
            <FormAutocompleteTextField
              control={control}
              name='country'
              label='Country'
              options={countryCodes ?? []}
              autoHighlight
              required
              getOptionLabel={(option: any) => option?.label ?? ''}
              renderOption={(props, option: any) => (
                <Box
                  component="li"
                  sx={{ fontSize: 15, '& > span': { mr: '10px', fontSize: 18 } }}
                  {...props}
                >
                  <span>{countryToFlag(option.code)}</span>
                  {option.code} {option.label}
                </Box>
              )}
            />
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>{t('common:close')}</Button>
          <Button disabled={!isValid || !cardComplete || !stripe || loading} type="submit" onClick={handleClose} variant='contained'>{t('common:add')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

const BillingAddressForm = ({ loading, control }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <FormTextField
        label={t('pricing:addressLine1')}
        fullWidth
        size='small'
        margin='dense'
        disabled={loading}
        name='addressLine1'
        control={control}
        defaultValue=''
        controllerProps={{
          rules: {
            required: true,
            minLength: 3,
          }
        }}
      />
      <FormTextField
        label={t('pricing:addressLine2')}
        fullWidth
        size='small'
        margin='dense'
        disabled={loading}
        name='addressLine2'
        control={control}
        defaultValue=''
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormTextField
          sx={{ flex: '1 1 66%' }}
          label={t('pricing:city')}
          fullWidth
          size='small'
          margin='dense'
          disabled={loading}
          name='city'
          control={control}
          defaultValue=''
          controllerProps={{
            rules: {
              required: true,
            }
          }}
        />
        <FormTextField
          sx={{ flex: '0 1 33%' }}
          label={t('pricing:postalCode')}
          fullWidth
          size='small'
          margin='dense'
          disabled={loading}
          name='postalCode'
          control={control}
          defaultValue=''
          controllerProps={{
            rules: {
              required: true,
              pattern: {
                value: /^\d+$/g,
                message: "Invalid postal code",
              }
            }
          }}
        />
      </Box>
    </React.Fragment>
  )
}

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}