import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CurrentProjectSettingsQuery } from "types/gql";


interface ProjectBillingPaperProps {
  project?: CurrentProjectSettingsQuery['currentProject'];
}

const ProjectBillingPaper = ({ project }: ProjectBillingPaperProps) => {

  const { t } = useTranslation();

  return (
    <React.Fragment>

      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>
        <Typography variant='h6' gutterBottom>{t('settings:billing')}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography></Typography>
        </Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Invoices</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </React.Fragment>
  )
}

export default ProjectBillingPaper;