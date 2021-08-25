import { Box, Button, capitalize, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { CurrentProjectSettingsQuery, PaymentMethodImportance, useDeletePaymentMethodMutation, useGetPaymentMethodsLazyQuery, useUpdatePaymentMethodMutation } from 'types/gql';
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

const LazyDialogYN = dynamic(() => import('../elements/DialogYN'));
const LazyDialogPaymentMethod = dynamic(() => import('../elements/DialogPaymentMethod'));


const ProjectPaymentMethodPaper = ({ project }: ProjectPaymentMethodPaperProps) => {
  
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(false);
  const [menuPaymentMethodAnchorEl, setMenuPaymentMethodAnchorEl] = React.useState(null);
  const [menuPaymentMethod, setMenuPaymentMethod] = React.useState<PaymentMethod>(null);

  const [addPaymenthMethodDialog, setAddPaymenthMethodDialog] = React.useState(false);
  const [deletePaymentMethodConfirm, setDeletePaymentMethodConfirm] = React.useState(null);

  const [getPaymenMethods, { loading: getPaymentMethodsLoading }] = useGetPaymentMethodsLazyQuery({
    variables: {
      projectId: project.id,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted() {
      setLoading(false);
      setAddPaymenthMethodDialog(false);
    },
    fetchPolicy: 'network-only',
  });

  const [updatePaymentMethod, { loading: updateLoading }] = useUpdatePaymentMethodMutation({
    onCompleted() {
      getPaymenMethods();
    }
  });
  const [deletePaymentMethod, { loading: deleteLoading }] = useDeletePaymentMethodMutation({
    update(cache, { data }) {
      cache.modify({
        id: cache.identify(project),
        fields: {
          paymentMethods(existing, { toReference }) {
            const ref = toReference(data.deletePaymentMethod);
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
          importance: PaymentMethodImportance.Primary,
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

  const onPaymentMethodCreated = () => {
    setLoading(true);
    setTimeout(() => {
      getPaymenMethods();
    }, 1000);
  }

  return (
    <React.Fragment>
      <Lazy
        Component={LazyDialogPaymentMethod}
        open={addPaymenthMethodDialog}
        onCreated={onPaymentMethodCreated}
        handleClose={() => setAddPaymenthMethodDialog(false)}
        loading={loading}
      />
      <Lazy
        Component={LazyDialogYN}
        open={!!deletePaymentMethodConfirm}
        handleClose={() => setDeletePaymentMethodConfirm(false)}
        onSubmit={handleDelete}
        loading={deleteLoading}
        title='Are you sure?'
        content='After deleting the paymenth method it will not be used for futrure payments!'
        submitText='Delete'
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
        <MenuItem onClick={handleMenuDelete} disabled={menuPaymentMethod?.importance == PaymentMethodImportance.Primary}>
          Delete payment method
        </MenuItem>
      </Menu>
      <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

        <Typography variant='h6' gutterBottom>{t('settings:paymentMethods')}</Typography>

        <PaymentMethodPair
          t={t}
          project={project}
          setAddPaymenthMethodDialog={setAddPaymenthMethodDialog}
          handleUserMenuClick={handleUserMenuClick}
        />

      </Paper>
    </React.Fragment>
  )
}

export default ProjectPaymentMethodPaper;

interface PaymentMethodPairProps {
  t: any;
  project?: CurrentProjectSettingsQuery['currentProject'];
  setAddPaymenthMethodDialog: (b: boolean) => any;
  handleUserMenuClick: (paymentMethod: any) => (event: any) => any;
}

const PaymentMethodPair = ({ t, project, setAddPaymenthMethodDialog, handleUserMenuClick }: PaymentMethodPairProps) => {
  
  const primary = project.paymentMethods.find(e => e.importance == PaymentMethodImportance.Primary);
  const backup = project.paymentMethods.find(e => e.importance == PaymentMethodImportance.Backup);
  
  return (
    <List>
      {primary
        ? <PaymentMethodListItem t={t} paymentMethod={primary} handleUserMenuClick={handleUserMenuClick} />
        : <ListItem button onClick={() => setAddPaymenthMethodDialog(true)}>
            <ListItemIcon>
              <AddCircleIcon color={importanceToColor.PRIMARY as any} />
            </ListItemIcon>
            <ListItemText primary={'Add primary payment method'} />
          </ListItem>
      }
      {backup
        ? <PaymentMethodListItem t={t} paymentMethod={backup} handleUserMenuClick={handleUserMenuClick} />
        : <ListItem button disabled={!primary} onClick={() => setAddPaymenthMethodDialog(true)}>
            <ListItemIcon>
              <AddCircleIcon color={importanceToColor.BACKUP as any} />
            </ListItemIcon>
            <ListItemText primary={'Add backup payment method'} />
          </ListItem>
      }

    </List>
  )
}

interface PaymentMethodListProps {
  t: any;
  project?: CurrentProjectSettingsQuery['currentProject'];
  setAddPaymenthMethodDialog: (b: boolean) => any;
  handleUserMenuClick: (paymentMethod: any) => (event: any) => any;
}

const PaymentMethodList = ({ t, project, setAddPaymenthMethodDialog, handleUserMenuClick }: PaymentMethodListProps) => {
  return (
    <List>
      {project.paymentMethods.length == 0 &&
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography gutterBottom>No payment method has been added!</Typography>
          <Button variant='contained' onClick={() => setAddPaymenthMethodDialog(true)}>Add payment method</Button>
        </Box>
      }
      {project.paymentMethods.map(e => {
        return <PaymentMethodListItem key={e.id} t={t} paymentMethod={e} handleUserMenuClick={handleUserMenuClick} />
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
  )
}

const PaymentMethodListItem = ({ t, paymentMethod: e, handleUserMenuClick }: { t: any, paymentMethod: CurrentProjectSettingsQuery['currentProject']['paymentMethods'][0], handleUserMenuClick: (paymentMethod: any) => (event: any) => any,  }) => (
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

const importanceToColor = {
  'PRIMARY': 'primary',
  'BACKUP': 'secondary',
  'OTHER': 'disabled'
}