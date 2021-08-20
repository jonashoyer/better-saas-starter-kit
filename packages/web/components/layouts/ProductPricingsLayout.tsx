import React from "react";
import { Product, ProductPrice } from "@prisma/client";
import { Box } from "@material-ui/core";
import ProductPricing from '../elements/ProductPricing';


interface ProductPricingsLayoutProps {
  products: (Product & { prices: ProductPrice[] })[];
}

const ProductPricingsLayout = ({ products }: ProductPricingsLayoutProps) => {

  const priceFindFn = e => e.interval == 'month';

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {products.sort((a, b) => (a.prices.find(priceFindFn).unitAmount ?? Infinity) - (b.prices.find(priceFindFn).unitAmount ?? Infinity) ).map(e => {
          return <ProductPricing key={e.id} product={e} priceFindFn={priceFindFn} />
        })}
      </Box>
    </Box>
  )
}

export default ProductPricingsLayout;