import { Box, capitalize, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { useForm } from 'react-hook-form';
import usePollPaymentMethods from './usePollPaymentMethods';
import { ProjectSettingsQuery, useCreateStripeSetupIntentMutation } from '../types/gql';
import PaymentMethodForm from '../components/elements/PaymentMethodForm';
import PaymentIcon from '@mui/icons-material/Payment';

export type UseCardSelectionProps = {
  project?: ProjectSettingsQuery['project'];
  onPaymentMethodAdded?: () => void;
}

const useCardSelection = ({ project, onPaymentMethodAdded }: UseCardSelectionProps) => {

  const currentPaymentMethod = project.stripePaymentMethods.find(e => e.isDefault) ?? project.stripePaymentMethods[0] ?? null;

  const { t } = useTranslation();

  const stripe = useStripe();
  const elements = useElements();

  const form = useForm({ criteriaMode: 'firstError', mode: 'all' });
  const { reset } = form;

  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const stripeClientSecretRef = React.useRef(null);

  const [pollPaymentMethods, loadingPaymentMethods, stopPollPaymentMethods] = usePollPaymentMethods({
    projectId: project.id,
    async onCompleted() {
      setProcessing(false);

      onPaymentMethodAdded?.();

    },
  });
  
  const [createSetupIntent, { loading: createSetupIntentLoading }] = useCreateStripeSetupIntentMutation({
    variables: {
      projectId: project.id,
    }
  })

  const loading = processing || createSetupIntentLoading || loadingPaymentMethods;


  const Form = React.useCallback(() => {
    return (
      <Box>
        <Typography color='textSecondary' variant='body2'>{t('settings:paymentMethod', { count: 1 })}</Typography>
        {currentPaymentMethod &&
          <ListItem dense>
            <ListItemIcon>
              <PaymentIcon color='primary' />
            </ListItemIcon>
            <ListItemText primary={`${capitalize(currentPaymentMethod.brand)} •••• ${currentPaymentMethod.last4}`} secondary={`${t('pricing:expires')} ${currentPaymentMethod.expMonth}/${currentPaymentMethod.expYear}`} />
          </ListItem>
        }
        {!currentPaymentMethod &&
          <PaymentMethodForm
            autoFocus
            form={form}
            setCardComplete={setCardComplete}
            loading={loading}
            setError={setError}
          />
        }
      </Box>
    )
  }, [currentPaymentMethod, form, loading, t]);

  const getClientSecret = React.useCallback(async () => {
    if (!stripeClientSecretRef.current) {
      const { data } = await createSetupIntent();
      stripeClientSecretRef.current = data.createStripeSetupIntent.clientSecret;
    }

    return stripeClientSecretRef.current;
    
  }, [createSetupIntent]);

  const clearClientSecret = React.useCallback(() => {
    stripeClientSecretRef.current = null;
  }, []);

  const submitPaymentMethod = React.useCallback(async () => {

    const data = form.getValues();

    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements.getElement("card").focus();
      return;
    }

    if (!cardComplete) {
      return;
    }

    const stripeClientSecret = await getClientSecret();

    setProcessing(true);
    await pollPaymentMethods();


    const payload = await stripe.confirmCardSetup(
      stripeClientSecret,
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


    if (payload.error) {
      console.log('[error]', payload.error);
      setError(payload.error);
      setProcessing(false);
      stopPollPaymentMethods();
      return;
    }

    console.log('[PaymentMethod]', payload.setupIntent);
    clearClientSecret();

  }, [cardComplete, clearClientSecret, elements, error, form, getClientSecret, pollPaymentMethods, stopPollPaymentMethods, stripe]);



  return {
    form,
    Form,
    reset,
    cardComplete,
    error,
    submitPaymentMethod,
    loading,
  }
}

export default useCardSelection;