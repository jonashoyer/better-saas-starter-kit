import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Chip, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { ProjectSettingsQuery, InvoiceStatus } from "types/gql";
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import { snakeToReadable } from "../../utils";

interface ProjectInvoicePaperProps {
  project?: ProjectSettingsQuery['project'];
}

const ProjectInvoicePaper = ({ project }: ProjectInvoicePaperProps) => {

  const { t } = useTranslation();

  const overdueInvoices = React.useMemo(() => {
    return project.stripeInvoices.filter(e => e.dueDate && e.status == InvoiceStatus.Open && dayjs(e.dueDate).unix() < dayjs().unix());
  }, [project.stripeInvoices]);

  const invoices = React.useMemo(() => {
    return [...project.stripeInvoices].sort((a, b) => dayjs(b.created).unix() - dayjs(a.created).unix());
  }, [project.stripeInvoices]);

  return (
    <React.Fragment>

      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>
        <Typography variant='h6' gutterBottom>{t('settings:invoices')}</Typography>

        {overdueInvoices.length != 0 &&
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>{t('settings:overdueInvoices')}</Typography>
          </Box>
        }

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1'>{t('settings:paidInvoiceReceipts')}</Typography>
        </Box>

        <List dense>
          {invoices.map(e => {

            return (
              <React.Fragment key={e.id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      download
                      target='_blank'
                      href={e.invoicePdf}
                    >
                      <DownloadIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography component='span' variant='body2'>{dayjs(e.created).format('D MMMM YYYY')}</Typography>
                        <Typography component='span' variant='body2' color='textSecondary'>{' '}- {snakeToReadable(e.status)}</Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {t('settings:invoiceAmount', { amount: (e.amountPaid / 100).toFixed(2) })}
                        </Typography>
                        {e.receiptNumber && `- #${e.receiptNumber}`}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            )
          })}
        </List>
      </Paper>
    </React.Fragment>
  )
}

export default ProjectInvoicePaper;