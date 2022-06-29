import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export enum Position {
  TopLeft = 'TOP_LEFT',
  TopRight = 'TOP_RIGHT',
  BottomRight = 'BOTTOM_RIGHT',
  BottomLeft = 'BOTTOM_LEFT'
}

export interface ComponentPreviewProps {
  components: JSX.Element[];
  defaultIndex?: number;
  position?: Position;
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
      {props.components.length > 1 &&
        <Box className='preview-handler' sx={{ ...positionEnumToCSSPosition(props.position ?? Position.BottomRight, 8), opacity: 0, transition: 'opacity 150ms linear', position: 'absolute', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton disabled={index == 0} size='small' onClick={onBack}>
            <ArrowBackIosIcon fontSize='small' />
          </IconButton>
          <Typography color='textSecondary'>{index}</Typography>
          <IconButton disabled={index == props.components.length - 1} size='small' onClick={onForward}>
            <ArrowForwardIosIcon fontSize='small' />
          </IconButton>
        </Box>
      }
    </Box>
  )
}

export default ComponentPreview;

const positionEnumToCSSPosition = (pos: Position, spacing?: number) => {
  switch(pos) {
    case Position.TopLeft: return { top: spacing, left: spacing };
    case Position.TopRight: return { top: spacing, right: spacing };
    case Position.BottomRight: return { bottom: spacing, right: spacing };
    case Position.BottomLeft: return { bottom: spacing, left: spacing };
  }
}