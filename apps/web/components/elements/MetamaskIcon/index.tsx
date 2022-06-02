import { SvgIcon, SvgIconProps } from '@mui/material';
import Metamask from './metamask-fox.svg';

const MetamaskIcon = (props: SvgIconProps) => {
  return <SvgIcon component={Metamask} inheritViewBox {...props} />
}

export default MetamaskIcon;