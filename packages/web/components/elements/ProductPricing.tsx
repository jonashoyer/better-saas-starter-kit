import React from "react";
import { Product, ProductPrice } from "@prisma/client";
import { Box, Paper, Typography } from "@material-ui/core";
import { formatCurrency } from 'bs-shared-kit';
import useTranslation from 'next-translate/useTranslation'


export interface ProductPricingProps {
  product: Product & { prices: ProductPrice[] };
  priceFindFn: (price: ProductPrice) => boolean;
}

const ProductPricing = ({ product, priceFindFn }: ProductPricingProps) => {

  const price = product.prices.find(priceFindFn);

  const { t, lang } = useTranslation();

  return (
    <Paper sx={{ maxWidth: 256, width: '100%' }}>
      <Box sx={{ padding: 2, background: '#444', color: '#fff', borderRadius: 1, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <Typography variant='h6'>{product.name}</Typography>
        <Typography variant='h4'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })}</Typography>
        <Typography color='#ffffffcc' variant='body2'>per {price.intervalCount != 1 && price.intervalCount} {price.interval}{price.intervalCount != 1 && 's'}</Typography>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Typography variant='body1'>{t(`pricing:${product.type.toLowerCase()}_description`)}</Typography>
      </Box>
    </Paper>
  )
}

export default ProductPricing;