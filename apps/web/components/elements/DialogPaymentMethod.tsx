import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ProjectSettingsQuery, useCreateStripeSetupIntentMutation, useReplacePrimaryPaymentMethodMutation } from 'types/gql';
import FormTextField from './FormTextField';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PaymentMethodForm from './PaymentMethodForm';
import usePollPaymentMethods from '../../hooks/usePollPaymentMethods';

export type DialogPaymentMethodProps = {
  project?: ProjectSettingsQuery['project'];
  open: boolean;
  handleClose: () => any;
  replacePrimary?: boolean;
}

// https://stripe.com/docs/stripe-js/react
// https://codesandbox.io/s/react-stripe-js-card-detailed-omfb3?file=/src/App.js
// https://github.com/stripe-samples/subscription-use-cases
// https://stripe.com/docs/payments/save-and-reuse

export default function DialogPaymentMethod({ project, open, handleClose, replacePrimary }: DialogPaymentMethodProps) {

  const { t, lang } = useTranslation();
  

  const [replacePrimaryPaymentMethod, { loading: loadingReplacePrimaryPaymentMethod }] = useReplacePrimaryPaymentMethodMutation({
    onCompleted() {
      handleClose();
    },
    update(cache, { data }) {
      
      cache.modify({
        id: cache.identify({ id: project.id, __typename: 'Project' }),
        fields: {
          stripeSubscriptions(arr, { readField }) {
            return arr.filter(e => readField('id', e) === data.replacePrimaryPaymentMethod.id);
          }
        },
      })
    },
  });

  const [primaryReplacement, setPrimaryReplacement] = React.useState<string | null>(null);

  const [pollPaymentMethods, pollingPaymentMethods, stopPollPaymentMethods] = usePollPaymentMethods({
    projectId: project?.id,
    onCompleted() {

      if (replacePrimary && primaryReplacement) {
        replacePrimaryPaymentMethod({
          variables: {
            id: primaryReplacement,
          }
        });
        return;
      }

      handleClose();
    },
    onFailed() {
      console.error('timeouted!');
    }
  });

  const stripe = useStripe();
  const elements = useElements();

  const form = useForm({ criteriaMode: 'firstError', mode: 'all' });
  const { reset } = form;

  const isSetupIntentUsedRef = React.useRef(false);

  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const [clientSecret, setClientSecret] = React.useState(null);

  const [createSetupIntent, { loading: createSetupIntentLoading }] = useCreateStripeSetupIntentMutation({
    variables: {
      projectId: project?.id,
    }
  })

  const newSetupIntent = React.useCallback(async () => {
    try {
      const { data } = await createSetupIntent()
      setClientSecret(data.createStripeSetupIntent.clientSecret);
    } catch {
      // TODO:
      // console.error(err);
    }
  }, [createSetupIntent]);

  React.useEffect(() => {
    if (!open) return;
    if (isSetupIntentUsedRef.current) {
      newSetupIntent();
      isSetupIntentUsedRef.current = false;
    }

    reset();
    setCardComplete(false);
    setProcessing(false);
    setError(null);
    setPrimaryReplacement(null);
  }, [reset, open, newSetupIntent]);

  

  React.useEffect(() => {
    if (clientSecret) return;
    newSetupIntent();

  }, [clientSecret, newSetupIntent]);

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

    await pollPaymentMethods();

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
      stopPollPaymentMethods();
      return;
    }

    isSetupIntentUsedRef.current = true;
    console.log('[PaymentMethod]', payload.setupIntent);
    setPrimaryReplacement(payload.setupIntent.payment_method as string);
  };

  const loading = processing || createSetupIntentLoading || pollingPaymentMethods || loadingReplacePrimaryPaymentMethod;


  // TODO: Add spinner overlay
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{replacePrimary ? t('settings:newPaymentMethod') : t('settings:addPaymentMethod')}</DialogTitle>
      <form onSubmit={form.handleSubmit(confirmCardSetup)}>
        <DialogContent>
          <PaymentMethodForm
            autoFocus
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

