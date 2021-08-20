import React from 'react';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import { Product, ProductPrice } from '@prisma/client';
import { formatCurrency } from '../../../shared/lib';
import DialogChangePlan from '../elements/DialogChangePlan';
import { isJSONValueObject } from 'utils';

interface ProjectPlanPaperProps {
  products: (Product & { prices: ProductPrice[] })[];
}

const ProjectPlanPaper = ({ products }: ProjectPlanPaperProps) => {

  const { t, lang } = useTranslation();
  const priceFindFn = e => e.interval == 'month';

  const [changePlan, setChangePlan] = React.useState(null);


  const sortedProducts = products.sort((a, b) => (a.prices.find(priceFindFn).unitAmount ?? Infinity) - (b.prices.find(priceFindFn).unitAmount ?? Infinity) );

  return (
    <React.Fragment>
      <DialogChangePlan
        open={!!changePlan}
        handleClose={() => setChangePlan(null)}
      />
      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant='h6'>{t('common:plan')}</Typography>
        </Box>
        <Box>
          {sortedProducts.map(e => {
            const price = e.prices.find(priceFindFn);
            const isFeatured = isJSONValueObject(e.metadata) && !!e.metadata.featured;
            const itemSx = isFeatured ? { border: '1px solid', borderRadius: 2, borderColor: t => `${t.palette.primary.main}88` } : { borderBottom: '1px solid #eee' };
            return (
              <Box key={e.id} sx={{ py: 1.5, px: 2, display: 'flex', justifyContent: 'space-between', ...itemSx }}>
                <Box sx={{ pr: 1 }}>
                  {isFeatured &&  <Typography variant='caption' color='primary'>Recommended</Typography>}
                  <Typography variant='subtitle1'>{e.name}</Typography>
                  <Typography variant='body2' color='textSecondary'>{t(`pricing:${e.type.toLowerCase()}_description`)}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography sx={{ lineHeight: '1' }} variant='subtitle1'>{formatCurrency(lang, price.currency, price.unitAmount / 100, { shortFraction: true })}</Typography>
                    <Typography variant='caption' color='textSecondary'>per {price.intervalCount != 1 && price.intervalCount} {price.interval}{price.intervalCount != 1 && 's'}</Typography>
                  </Box>
                  <Box>
                    <Button sx={{ minWidth: 92 }} variant='outlined' onClick={() => setChangePlan(e)}>Switch</Button>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Paper>
    </React.Fragment>
  )
}

export default ProjectPlanPaper;