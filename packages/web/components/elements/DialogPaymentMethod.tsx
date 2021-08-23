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

export type DialogPaymentMethodProps = {
  open: boolean;
  handleClose: () => any;
}

// https://stripe.com/docs/stripe-js/react
// https://codesandbox.io/s/react-stripe-js-card-detailed-omfb3?file=/src/App.js
// https://github.com/stripe-samples/subscription-use-cases

export default function DialogPaymentMethod({ open,  handleClose }: DialogPaymentMethodProps) {

  const { t, lang } = useTranslation();

  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm({ criteriaMode: 'firstError', mode: 'all' });
  
  React.useEffect(() => {
    if (!open) return;
    reset();
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
              line1: data.addressLine1,
              line2: data.addressLine2,
              city: data.city,
              postal_code: data.postalCode,
              // country:
            },
            name: data.cardholderName,
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
              label={t('pricing:cardholderName')}
              autoFocus
              fullWidth
              size='small'
              margin='dense'
              disabled={loading}
              name='cardholderName'
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