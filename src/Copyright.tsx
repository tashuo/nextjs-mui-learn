import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <MuiLink color="inherit" href="https://www.aisheishei.me/">
        爱谁谁
      </MuiLink>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
