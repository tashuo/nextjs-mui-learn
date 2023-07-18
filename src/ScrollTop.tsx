import { Box, Fade, useScrollTrigger } from "@mui/material";

export default function ScrollTop({children}: {children: any}) {
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 100,
    });
  
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth',
      });
    };
  
    return (
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
        >
          {children}
        </Box>
      </Fade>
    );
}