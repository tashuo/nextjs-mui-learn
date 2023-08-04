import { Box, Fade, useScrollTrigger } from "@mui/material";

export default function AddPostButton({children, setState}: {children: any, setState: Function}) {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setState(true);
    };
  
    return (
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 130, right: 16 }}
      >
        {children}
      </Box>
    );
}