import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useUpdateProjectMutation } from 'types/gql';
import { LoadingButton } from '@material-ui/lab';

export interface ProjectEditDialogProps {
  open: boolean;
  onClose: () => any;
}

function ProjectEditDialog({ open, project, onClose }) {

  const [name, setName] = React.useState(null)

  const [updateProject, { loading }] = useUpdateProjectMutation({
    onCompleted() {
      onClose();
    },
    context: { serverless: true }
  });

  React.useEffect(() => {
    setName(project.name);
  }, [project]);

  const onSave = () => {
    updateProject({
      variables: {
        updateProjectUpdate: {
          id: project.id,
          name,
        }
      }
    })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Lorem ipsum dolor sit amet consectetur.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          fullWidth
          variant="standard"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose}>Cancel</Button>
        <LoadingButton loading={loading} variant='contained' onClick={onSave}>Save</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectEditDialog;