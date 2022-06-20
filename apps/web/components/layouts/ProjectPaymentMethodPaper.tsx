import { Box, Button, capitalize, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { ProjectSettingsQuery, useDeleteStripePaymentMethodMutation, useGetPaymentMethodsLazyQuery, useUpdateStripePaymentMethodMutation } from 'types/gql';
import PaymentIcon from '@mui/icons-material/Payment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import dynamic from 'next/dynamic';
import Lazy from 'components/elements/Lazy';
import { StripePaymentMethod } from '@prisma/client';
import usePollPaymentMethods from 'hooks/usePollPaymentMethods';
import ComponentPreview from './ComponentPreview';

export interface ProjectPaymentMethodPaperProps {
  project?: ProjectSettingsQuery['project'];
}

const LazyDialogYN = dynamic(() => import('../elements/DialogYN'));
const LazyDialogPaymentMethod = dynamic(() => import('../elements/DialogPaymentMethod'));


const ProjectPaymentMethodPaper = ({ project }: ProjectPaymentMethodPaperProps) => {
  
  const { t } = useTranslation();

  const [menuPaymentMethodAnchorEl, setMenuPaymentMethodAnchorEl] = React.useState(null);
  const [menuPaymentMethod, setMenuPaymentMethod] = React.useState<StripePaymentMethod>(null);

  const [addPaymenthMethodDialog, setAddPaymenthMethodDialog] = React.useState(false);
  const [deletePaymentMethodConfirm, setDeletePaymentMethodConfirm] = React.useState(null);

  const [pollPaymentMethods, pollingPaymentMethods] = usePollPaymentMethods({
    projectId: project.id,
    paymentMethods: project.stripePaymentMethods,
    onCompleted() {
      setAddPaymenthMethodDialog(false);
    },
    onFailed() {
      console.error('timeouted!');
    }
  })

  const [getPaymenMethods, { loading: getPaymentMethodsLoading }] = useGetPaymentMethodsLazyQuery({
    variables: {
      projectId: project.id,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted() {
      setAddPaymenthMethodDialog(false);
    },
    fetchPolicy: 'network-only',
  });

  const [updatePaymentMethod, { loading: updateLoading }] = useUpdateStripePaymentMethodMutation({
    onCompleted() {
      getPaymenMethods();
    }
  });
  const [deletePaymentMethod, { loading: deleteLoading }] = useDeleteStripePaymentMethodMutation({
    update(cache, { data }) {
      cache.modify({
        id: cache.identify(project),
        fields: {
          paymentMethods(existing, { toReference }) {
            const ref = toReference(data.deleteStripePaymentMethod);
            return existing.filter((e: any) => e.__ref !== ref.__ref);
          }
        }
      })
      setDeletePaymentMethodConfirm(null);
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

    updatePaymentMethod({
      variables: {
        input: {
          id: menuPaymentMethod.id,
          isDefault: true,
        }
      }
    })

    handlePaymentMethodMenuClose();
  }

  const handleMenuDelete = () => {
    setDeletePaymentMethodConfirm(menuPaymentMethod);
    handlePaymentMethodMenuClose();
  }

  const handleDelete = () => {
    deletePaymentMethod({
      variables: {
        id: deletePaymentMethodConfirm.id,
      }
    })
  }

  return (
    <React.Fragment>
      <Lazy
        Component={LazyDialogPaymentMethod}
        open={addPaymenthMethodDialog}
        onCreated={pollPaymentMethods}
        handleClose={() => setAddPaymenthMethodDialog(false)}
        loading={pollingPaymentMethods}
      />
      <Lazy
        Component={LazyDialogYN}
        open={!!deletePaymentMethodConfirm}
        handleClose={() => setDeletePaymentMethodConfirm(false)}
        onSubmit={handleDelete}
        loading={deleteLoading}
        title={t('pricing:deletePaymentMethodTitle')}
        content={t('pricing:deletePaymentMethodBody')}
        submitText={t('pricing:deletePaymentMethodBodySubmit')}
      />
      <Menu
        id="payment-method-menu"
        anchorEl={menuPaymentMethodAnchorEl}
        open={!!menuPaymentMethodAnchorEl}
        onClose={handlePaymentMethodMenuClose}
      >
        <MenuItem onClick={handleSetAsPrimary} disabled={menuPaymentMethod?.isDefault}>
          {t('pricing:setAsPrimary')}
        </MenuItem>
        <MenuItem onClick={handleMenuDelete} disabled={menuPaymentMethod?.isDefault}>
          {t('pricing:deletePaymentMethod')}
        </MenuItem>
      </Menu>
      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

        <Typography variant='h6' gutterBottom>{t('settings:paymentMethod', { count: 99 })}</Typography>
        <ComponentPreview
          components={[
            <PaymentMethodPair
              key={0}
              t={t}
              project={project}
              setAddPaymenthMethodDialog={setAddPaymenthMethodDialog}
              handleUserMenuClick={handleUserMenuClick}
            />,
            <PaymentMethodList
              key={1}
              t={t}
              project={project}
              setAddPaymenthMethodDialog={setAddPaymenthMethodDialog}
              handleUserMenuClick={handleUserMenuClick}
            />,
            <PaymentMethodSingle
              key={2}
              t={t}
              project={project}
              setAddPaymenthMethodDialog={setAddPaymenthMethodDialog}
            />,
          ]}
        />

      </Paper>
    </React.Fragment>
  )
}

export default ProjectPaymentMethodPaper;

interface PaymentMethodPairProps {
  t: any;
  project?: ProjectSettingsQuery['project'];
  setAddPaymenthMethodDialog: (b: boolean) => any;
  handleUserMenuClick: (paymentMethod: any) => (event: any) => any;
}

const PaymentMethodPair = ({ t, project, setAddPaymenthMethodDialog, handleUserMenuClick }: PaymentMethodPairProps) => {
  
  const primary = project.stripePaymentMethods.find(e => e.isDefault);
  const backup = project.stripePaymentMethods.find(e => !e.isDefault);
  
  return (
    <List>
      {primary
        ? <PaymentMethodListItem t={t} paymentMethod={primary} handleUserMenuClick={handleUserMenuClick} />
        : <ListItem button onClick={() => setAddPaymenthMethodDialog(true)}>
            <ListItemIcon>
              <AddCircleIcon color='primary' />
            </ListItemIcon>
            <ListItemText primary={t('pricing:addPrimaryPaymentMethod')} />
          </ListItem>
      }
      {backup
        ? <PaymentMethodListItem t={t} paymentMethod={backup} handleUserMenuClick={handleUserMenuClick} />
        : <ListItem button disabled={!primary} onClick={() => setAddPaymenthMethodDialog(true)}>
            <ListItemIcon>
              <AddCircleIcon color='secondary' />
            </ListItemIcon>
            <ListItemText primary={t('pricing:addAlternativePaymentMethod')} />
          </ListItem>
      }

    </List>
  )
}

interface PaymentMethodListProps {
  t: any;
  project?: ProjectSettingsQuery['project'];
  setAddPaymenthMethodDialog: (b: boolean) => any;
  handleUserMenuClick: (paymentMethod: any) => (event: any) => any;
}

const PaymentMethodList = ({ t, project, setAddPaymenthMethodDialog, handleUserMenuClick }: PaymentMethodListProps) => {
  return (
    <List>
      {project.stripePaymentMethods.length == 0 &&
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography gutterBottom>{t('pricing:noPaymentMethodOnFile')}</Typography>
          <Button variant='contained' onClick={() => setAddPaymenthMethodDialog(true)}>{t('pricing:addPaymentMethod')}</Button>
        </Box>
      }
      {project.stripePaymentMethods.map(e => {
        return <PaymentMethodListItem key={e.id} t={t} paymentMethod={e} handleUserMenuClick={handleUserMenuClick} />
      })}
      {project.stripePaymentMethods.length != 0 &&
        <ListItemButton onClick={() => setAddPaymenthMethodDialog(true)}>
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon>
          <ListItemText primary={t('pricing:addPaymentMethod')} />
        </ListItemButton>
      }
    </List>
  )
}

const PaymentMethodListItem = ({ t, paymentMethod: e, handleUserMenuClick }: { t: any, paymentMethod: ProjectSettingsQuery['project']['stripePaymentMethods'][0], handleUserMenuClick: (paymentMethod: any) => (event: any) => any,  }) => (
  <ListItem
    secondaryAction={
      <IconButton onClick={handleUserMenuClick(e)} disabled={e?.isDefault}>
        <MoreVertIcon />
      </IconButton>
    }
  >
    <ListItemIcon>
      <PaymentIcon color={e.isDefault ? 'primary' : 'secondary'} />
    </ListItemIcon>
    <ListItemText primary={`${capitalize(e.brand)} •••• ${e.last4}${e.isDefault ? ` - ${t('pricing:cardPrimary')}` : ''}`} secondary={`${t('pricing:expires')} ${e.expMonth}/${e.expYear}`} />
  </ListItem>
)

interface PaymentMethodSingleProps {
  t: any;
  project?: ProjectSettingsQuery['project'];
  setAddPaymenthMethodDialog: (b: boolean) => any;
}


const PaymentMethodSingle = ({ t, project, setAddPaymenthMethodDialog }: PaymentMethodSingleProps) => {

  return (
    <List>
      {project.stripePaymentMethods.length == 0 &&
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography gutterBottom>{t('pricing:noPaymentMethodOnFile')}</Typography>
          <Button variant='contained' onClick={() => setAddPaymenthMethodDialog(true)}>{t('pricing:addPaymentMethod')}</Button>
        </Box>
      }
      {project.stripePaymentMethods.map(e => {
        return <PaymentMethodSingleItem key={e.id} t={t} paymentMethod={e} setAddPaymenthMethodDialog={setAddPaymenthMethodDialog} />
      })}
    </List>
  )
}

const PaymentMethodSingleItem = ({ t, paymentMethod: e, setAddPaymenthMethodDialog }: { t: any, paymentMethod: ProjectSettingsQuery['project']['stripePaymentMethods'][0], setAddPaymenthMethodDialog: (b: boolean) => any, }) => (
  <ListItem
    secondaryAction={
      <Button variant='outlined' onClick={() => setAddPaymenthMethodDialog(true)}>Change</Button>
    }
  >
    <ListItemIcon>
      <PaymentIcon color={e.isDefault ? 'primary' : 'secondary'} />
    </ListItemIcon>
    <ListItemText primary={`${capitalize(e.brand)} •••• ${e.last4}`} secondary={`${t('pricing:expires')} ${e.expMonth}/${e.expYear}`} />
  </ListItem>
)