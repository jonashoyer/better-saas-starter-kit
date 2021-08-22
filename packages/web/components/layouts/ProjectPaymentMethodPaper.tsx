import { Box, Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { CurrentProjectSettingsQuery } from 'types/gql';
import PaymentIcon from '@material-ui/icons/Payment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import dynamic from 'next/dynamic';
import Lazy from 'components/elements/Lazy';

export interface ProjectPaymentMethodPaperProps {
  project?: CurrentProjectSettingsQuery['currentProject'];
}

const LazyDialogPaymentMethod = dynamic(() => import('../elements/DialogPaymentMethod'));


const ProjectPaymentMethodPaper = ({ project }: ProjectPaymentMethodPaperProps) => {

  const { t } = useTranslation();

  const [addPaymenthMethodDialog, setAddPaymenthMethodDialog] = React.useState(false);

  return (
    <React.Fragment>
      <Lazy
        Component={LazyDialogPaymentMethod}
        open={addPaymenthMethodDialog}
        handleClose={() => setAddPaymenthMethodDialog(false)}
      />
      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

        <Typography variant='h6' gutterBottom>{t('settings:paymentMethods')}</Typography>

        <List>
          {project.paymentMethods.length == 0 &&
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography gutterBottom>No payment method has been added!</Typography>
              <Button variant='contained' onClick={() => setAddPaymenthMethodDialog(true)}>Add payment method</Button>
            </Box>
          }
          {project.paymentMethods.map(e => (
            <ListItem
              key={e.id}
              secondaryAction={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText primary='Wi-Fi' />
            </ListItem>
          ))}
          {project.paymentMethods.length != 0 &&
            <ListItemButton>
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