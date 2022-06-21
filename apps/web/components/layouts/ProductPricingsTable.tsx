import React from "react";
import { Box,  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { StripeProductWithPricing } from "../../types/types";
import { PricingDisplay } from "./ProjectPlanPaper";
import { LoadingButton } from "@mui/lab";

export interface ProductPricingsLayoutProps {
  products: StripeProductWithPricing[];
  currentProduct?: StripeProductWithPricing;
  upcomingPriceId?: string;
  component?: any;
  onPlanSwitch?: (product: StripeProductWithPricing) => any;
  onCancelDowngrade?: () => any;
  cancelLoading?: boolean;
}

const monthlyPriceFindFn = e => e.interval == 'month';
const yearlyPriceFindFn = e => e.interval == 'year';

const ProductPricingsTable = ({ component, products, onPlanSwitch, onCancelDowngrade, cancelLoading, currentProduct, upcomingPriceId }: ProductPricingsLayoutProps) => {

  const { t, lang } = useTranslation();
  
  const productPricingFn = React.useMemo(() => {
    return (product: StripeProductWithPricing) => (product.stripePrices.find(yearlyPriceFindFn) || product.stripePrices.find(monthlyPriceFindFn));
  }, []);
  
  const sortedPrimaryProducts = React.useMemo(() => {
    return products.filter(e => e.metadata.type === 'primary').sort((a, b) => (productPricingFn(a)?.unitAmount ?? Infinity) - (productPricingFn(b)?.unitAmount ?? Infinity) );
  }, [productPricingFn, products]);

  const currentProductIndex = sortedPrimaryProducts.findIndex(e => e.id == currentProduct?.id);

  return (
    <Box sx={{ minWidth: 650, maxWidth: 900 }}>
      <TableContainer component={component}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} />
                {sortedPrimaryProducts.map(e => (
                  <TableCell key={e.id} sx={{ width: 192 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant='h6'>{e.name}</Typography>
                      <Typography variant='body2'>{t(`pricing:${e.metadata.key?.toLowerCase()}Description`, { default: '' })}</Typography>
                    </Box>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} component="th" scope="row" />
              {sortedPrimaryProducts.map((e, i) => {
                const price = productPricingFn(e);
                const isCurrentProduct = i == currentProductIndex;
                const isUpcoming = price?.id == upcomingPriceId;

                return (
                  <TableCell key={e.id} sx={{ width: 192 }}>
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column' }}>
                      {price && <PricingDisplay t={t} lang={lang} price={price} hideFree={!!onPlanSwitch || isCurrentProduct} />}
                      {onPlanSwitch && <LoadingButton sx={{ mt: .5 }} loading={isCurrentProduct && cancelLoading} disabled={isUpcoming || (!upcomingPriceId && isCurrentProduct)} onClick={() => isCurrentProduct ? onCancelDowngrade() : onPlanSwitch(e)} variant='outlined' size='small'>{isCurrentProduct ? (upcomingPriceId ? t('pricing:stay') : t('pricing:current')) : (isUpcoming ? t('pricing:upcoming') : (currentProductIndex < i ? t('pricing:upgrade') : t('pricing:downgrade')))}</LoadingButton>}
                    </Box>
                  </TableCell>
                )
              })}

            </TableRow>
            {planFeatures.map(({ label, description, ...plans}, i) => (
              <TableRow
                key={i}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell colSpan={2} component="th" scope="row">
                  <Typography variant='subtitle2'>{label}</Typography>
                  <Typography variant='body2'>{description}</Typography>
                </TableCell>
                {Object.entries(plans).map(([type, e]) => (
                  <TableCell key={type} sx={{ width: 192 }} align="center">{formatPlanFeatureValue(e)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const formatPlanFeatureValue = (e: React.ReactNode) => {
  if (e === true) return <CheckIcon color='success' />
  if (e === false) return <CloseIcon color='error' />
  return e;
}

export default ProductPricingsTable;

const planFeatures: (Record<string, React.ReactNode> & { label: string, description?: string })[] =  [{
  label: 'Feature#1',
  description: 'A awesome feature',
  FREE: true,
  BASIC: true,
  PREMIUM: true,
}, {
  label: 'Feature#2',
  description: 'A awesome feature',
  FREE: false,
  BASIC: false,
  PREMIUM: true,
}, {
  label: 'Feature#3',
  description: 'A awesome feature',
  FREE: false,
  BASIC: '3',
  PREMIUM: '12',
}]