import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTranslation from 'next-translate/useTranslation';
import {CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export type DialogPaymentMethodProps = {
  open: boolean;
  handleClose: () => any;
  
}

// https://stripe.com/docs/stripe-js/react
// https://codesandbox.io/s/react-stripe-js-card-detailed-omfb3?file=/src/App.js
// https://github.com/stripe-samples/subscription-use-cases

export default function DialogPaymentMethod({ open,  handleClose }: DialogPaymentMethodProps) {

  const { t, lang } = useTranslation();

  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [billingDetails, setBillingDetails] = React.useState({
    email: "",
    phone: "",
    name: "",
  });

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

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


    // Use your card Element with other Stripe.js APIs
    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });

    setProcessing(false);

    if (payload.error) {
      console.log('[error]', payload.error);
      setError(payload.error);
      return;
    }

    console.log('[PaymentMethod]', payload.paymentMethod);
  };

  const loading = processing;

  console.log(error, cardComplete)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('settings:addPaymentMethod')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <CardElement
            onChange={(e) => {
              setError(e.error);
              setCardComplete(e.complete);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>{t('common:close')}</Button>
          <Button disabled={!cardComplete || !stripe || loading} type="submit" onClick={handleClose} variant='contained'>{t('common:add')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}