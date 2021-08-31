import { IconButton, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

interface ComponentPreviewProps {
  components: JSX.Element[];
  defaultIndex?: number;
}

const ComponentPreview = (props: ComponentPreviewProps) => {

  const [index, setIndex] = React.useState(props.defaultIndex ?? 0);

  const onBack = () => {
    if (index <= 0) return;
    setIndex(index - 1);
  }

  const onForward = () => {
    if (index >= props.components.length - 1) return;
    setIndex(index + 1);
  }

  return (
    <Box sx={{ position: 'relative', ':hover .preview-handler': { opacity: 1 } }}>
      {props.components[index]}
      <Box className='preview-handler' sx={{ opacity: 0, transition: 'opacity 150ms linear', position: 'absolute', right: 8, bottom: 8, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton disabled={index == 0} size='small' onClick={onBack}>
          <ArrowBackIosIcon fontSize='small' />
        </IconButton>
        <Typography color='textSecondary'>{index}</Typography>
        <IconButton disabled={index == props.components.length - 1} size='small' onClick={onForward}>
          <ArrowForwardIosIcon fontSize='small' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default ComponentPreview;