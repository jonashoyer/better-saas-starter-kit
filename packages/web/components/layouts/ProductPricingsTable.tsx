import React from "react";
import { Product, ProductPrice, SubscriptionPlan } from "@prisma/client";
import { Box,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import useTranslation from "next-translate/useTranslation";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { formatCurrency } from "bs-shared-kit";

interface ProductPricingsLayoutProps {
  products: (Product & { prices: ProductPrice[] })[];
  component?: any;
}

const ProductPricingsTable = ({ component, products }: ProductPricingsLayoutProps) => {

  const { t, lang } = useTranslation();

  const priceFindFn = React.useCallback(e => e.interval == 'month', []);

  const sortedProducts = React.useMemo(() => {
    return products.sort((a, b) => (a.prices.find(priceFindFn).unitAmount ?? Infinity) - (b.prices.find(priceFindFn).unitAmount ?? Infinity) );
  }, [products, priceFindFn]);

  return (
    <Box sx={{ minWidth: 650, maxWidth: 800 }}>
      <TableContainer component={component}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} />
                {sortedProducts.map(e => (
                  <TableCell key={e.id} sx={{ width: 192 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant='h6'>{e.name}</Typography>
                      <Typography variant='body2'>{t(`pricing:${e.type.toLowerCase()}_description`)}</Typography>
                    </Box>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} component="th" scope="row">
                Pricing
              </TableCell>
              {sortedProducts.map(e => {
                const price = e.prices.find(priceFindFn);
                return (
                  <TableCell key={e.id} sx={{ width: 192 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ lineHeight: '1' }} variant='subtitle1'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })}</Typography>
                      <Typography variant='caption' color='textSecondary'>{t('pricing:perMember')} / {price.intervalCount != 1 && price.intervalCount} {t(`pricing:${price.interval}`, { count: price.intervalCount })}</Typography>
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

const planFeatures: (Record<SubscriptionPlan, React.ReactNode> & { label: string, description?: string })[] =  [{
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