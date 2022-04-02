import React from "react";;
import { Box } from "@mui/system";
import { motion, useTransform, useViewportScroll } from "framer-motion";

export interface DynamicAppBarProps {
  content: React.ReactNode;
}

const DynamicAppBar = ({ content }: DynamicAppBarProps) => {

  const { scrollY } = useViewportScroll();

  const background = useTransform(scrollY, [48, 70], ['#fff0', '#fffd']);
  const borderColor = useTransform(scrollY, [48, 70], ['#0000', '#0003']);

  const [showBoxShadow, setShowBoxShadow] = React.useState(false);

  React.useEffect(() => {

    function onChange() {
      const isShown = scrollY.get() > 70;
      isShown != showBoxShadow && setShowBoxShadow(isShown);
    }

    const unsubscribe = scrollY.onChange(onChange);
    return unsubscribe;
  }, [scrollY, showBoxShadow]);


  return (
    <Box
      component={motion.div}
      sx={{
        position: 'sticky',
        left: 0,
        right: 0,
        py: 1,
        color: '#000',
        transition: 'box-shadow .2s ease',
        boxShadow: showBoxShadow ? `0 0 15px 0 #0000001a` : '0 0 0 0 #0000001a',
        // backdropFilter: 'saturate(180%) blur(5px)',
        zIndex: (theme: any) => theme.zIndex.appBar,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        top: 0,
      }}
      style={{background, borderColor }}
    >
      <Box sx={{ maxWidth: 1532, mx: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
        {content}
      </Box>
    </Box>
  )
}

export default DynamicAppBar;