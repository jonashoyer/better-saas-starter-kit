import { Box, Button, capitalize, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { CurrentProjectSettingsQuery, PaymentMethodImportance, useGetPaymentMethodsLazyQuery } from 'types/gql';
import PaymentIcon from '@material-ui/icons/Payment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import dynamic from 'next/dynamic';
import Lazy from 'components/elements/Lazy';
import { snakeToReadable } from 'utils';
import { PaymentMethod } from '@prisma/client';

export interface ProjectPaymentMethodPaperProps {
  project?: CurrentProjectSettingsQuery['currentProject'];
}

const LazyDialogPaymentMethod = dynamic(() => import('../elements/DialogPaymentMethod'));


const ProjectPaymentMethodPaper = ({ project }: ProjectPaymentMethodPaperProps) => {

  const [loading, setLoading] = React.useState(false);
  const [menuPaymentMethodAnchorEl, setMenuPaymentMethodAnchorEl] = React.useState(null);
  const [menuPaymentMethod, setMenuPaymentMethod] = React.useState<PaymentMethod>(null);

  const { t } = useTranslation();

  const [addPaymenthMethodDialog, setAddPaymenthMethodDialog] = React.useState(false);

  const [getPaymenMethods, { loading: getPaymentMethodsLoading }] = useGetPaymentMethodsLazyQuery({
    onCompleted() {
      setLoading(false);
    }
  });

  const handleUserMenuClick = (paymentMethod: any) => (event: any) => {
    setMenuPaymentMethodAnchorEl(event.currentTarget);
    setMenuPaymentMethod(paymentMethod);
  };

  const handlePaymentMethodMenuClose = () => {
    setMenuPaymentMethodAnchorEl(null);
  };

  const handleSetAsPrimary = () => {

    handlePaymentMethodMenuClose();
  }

  const handleDelete = () => {

    handlePaymentMethodMenuClose();
  }

  return (
    <React.Fragment>
      <Lazy
        Component={LazyDialogPaymentMethod}
        open={addPaymenthMethodDialog}
        onCreated={() => {
          setLoading(true);
          setTimeout(() => {
            getPaymenMethods();
          }, 400);
        }}
        handleClose={() => setAddPaymenthMethodDialog(false)}
      />
      <Menu
        id="payment-method-menu"
        anchorEl={menuPaymentMethodAnchorEl}
        open={!!menuPaymentMethodAnchorEl}
        onClose={handlePaymentMethodMenuClose}
      >
        <MenuItem onClick={handleSetAsPrimary} disabled={menuPaymentMethod?.importance == PaymentMethodImportance.Primary}>
          Set as primary
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={menuPaymentMethod?.importance == PaymentMethodImportance.Primary}>
          Delete payment method
        </MenuItem>
      </Menu>
      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

        <Typography variant='h6' gutterBottom>{t('settings:paymentMethods')}</Typography>

        <List>
          {project.paymentMethods.length == 0 &&
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography gutterBottom>No payment method has been added!</Typography>
              <Button variant='contained' onClick={() => setAddPaymenthMethodDialog(true)}>Add payment method</Button>
            </Box>
          }
          {project.paymentMethods.map(e => {
            const importanceToColor = {
              'PRIMARY': 'primary',
              'BACKUP': 'secondary',
              'OTHER': 'disabled'
            }

            return (
              <ListItem
                key={e.id}
                secondaryAction={
                  <IconButton onClick={handleUserMenuClick(e)} disabled={e?.importance == PaymentMethodImportance.Primary}>
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <PaymentIcon color={importanceToColor[e.importance] as any} />
                </ListItemIcon>
                <ListItemText primary={`${capitalize(e.brand)} •••• ${e.last4} - ${snakeToReadable(e.importance)}`} secondary={`${t('pricing:expires')} ${e.expMonth}/${e.expYear}`} />
              </ListItem>
            )
          })}
          {project.paymentMethods.length != 0 &&
            <ListItemButton onClick={() => setAddPaymenthMethodDialog(true)}>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary='Add payment method' />
            </ListItemButton>
          }
        </List>

      </Paper>
    </React.Fragment>
  )
}

export default ProjectPaymentMethodPaper;