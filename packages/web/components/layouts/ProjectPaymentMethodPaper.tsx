import { IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { CurrentProjectSettingsQuery } from 'types/gql';
import PaymentIcon from '@material-ui/icons/Payment';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export interface ProjectPaymentMethodPaperProps {
  project?: CurrentProjectSettingsQuery['currentProject'];
}


const ProjectPaymentMethodPaper = ({ project }: ProjectPaymentMethodPaperProps) => {

  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

      <Typography variant='h6' gutterBottom>{t('settings:paymentMethod')}</Typography>

      <List>
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
            <ListItemText primary="Wi-Fi" />
          </ListItem>
        ))}
      </List>

    </Paper>
  )
}

export default ProjectPaymentMethodPaper;