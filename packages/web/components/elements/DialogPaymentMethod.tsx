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
import countryCodes from 'utils/countryCodes.json';
import { LoadingButton } from '@material-ui/lab';
import PaymentMethodForm from './PaymentMethodForm';

export type DialogPaymentMethodProps = {
  open: boolean;
  loading?: boolean;
  handleClose: () => any;
  onCreated?: () => any;
}

// https://stripe.com/docs/stripe-js/react
// https://codesandbox.io/s/react-stripe-js-card-detailed-omfb3?file=/src/App.js
// https://github.com/stripe-samples/subscription-use-cases
// https://stripe.com/docs/payments/save-and-reuse

export default function DialogPaymentMethod({ open, loading: outterLoading, onCreated, handleClose }: DialogPaymentMethodProps) {

  const { t, lang } = useTranslation();

  const [projectId] = useProject();

  const stripe = useStripe();
  const elements = useElements();

  const form = useForm({ criteriaMode: 'firstError', mode: 'all' });
  const { reset } = form;

  const isSetupIntentUsedRef = React.useRef(false);

  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const [clientSecret, setClientSecret] = React.useState(null);

  const [createSetupIntent, { loading: createSetupIntentLoading }] = useCreateSetupIntentMutation({
    variables: {
      projectId,
    }
  })

  React.useEffect(() => {
    if (!open) return;
    if (isSetupIntentUsedRef.current) {
      createSetupIntent(null);
      isSetupIntentUsedRef.current = false;
    }

    reset();
    setCardComplete(false);
    setProcessing(false);
    setError(null);
  }, [reset, open, createSetupIntent]);

  

  React.useEffect(() => {
    if (clientSecret) return;
    createSetupIntent()
    .then(({ data }) => {
      setClientSecret(data.createSetupIntent.clientSecret);
    }).catch(err => {
      // TODO: Catch this
      console.error(err);
    })

  }, [clientSecret, createSetupIntent]);

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
              country: data.country.code,
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

    isSetupIntentUsedRef.current = true;
    console.log('[PaymentMethod]', payload.setupIntent);
    onCreated?.();
  };

  const loading = processing || createSetupIntentLoading || outterLoading;


  // TODO: Add spinner overlay
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('settings:addPaymentMethod')}</DialogTitle>
      <form onSubmit={form.handleSubmit(confirmCardSetup)}>
        <DialogContent>
          <PaymentMethodForm
            form={form}
            loading={loading}
            setCardComplete={setCardComplete}
            setError={setError}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>{t('common:close')}</Button>
          <LoadingButton loading={!clientSecret || loading} disabled={!form.formState.isValid || !cardComplete || !stripe} type="submit" variant='contained'>{t('common:add')}</LoadingButton>
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

