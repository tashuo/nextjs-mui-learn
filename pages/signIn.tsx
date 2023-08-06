import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button, { ButtonProps } from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Copyright from '../src/Copyright';
import { useRouter } from 'next/router';
import { GitHub } from '@mui/icons-material';
import { common } from '@mui/material/colors';
import { CircularProgress } from '@mui/material';
import { getProfile, githubLogin } from '../api/user';
import { setCookie } from 'cookies-next';

export default function SignIn() {
  const [isLogining, setIsLogining] = React.useState(false);
  const router = useRouter();
  console.log(router.query);
  console.log(process.env);
  const code = router.query.code as string;
  const redirectUrl = encodeURIComponent(router.query.redirectUrl as string ?? '/');
  const githubRedirectUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_API_HOST}/signIn?redirectUrl=${redirectUrl}`);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectUrl}`;
  React.useEffect(() => {
      console.log(code);
      if (code) {
          setIsLogining(true);
          githubLogin(code)
            .then((response: { data: {access_token: string }}) => {
              console.log(response);
              console.log(response.data.access_token);
              localStorage.setItem('bearerToken', response.data.access_token);
              setCookie('token', response.data.access_token);
              return getProfile();
          }).then((profile) => {
              console.log(profile);
              localStorage.setItem('nickname', profile.data.username);
              localStorage.setItem('avatar', profile.data.avatar_url);
              localStorage.setItem('userId', profile.data.id.toString());
              setCookie('avatar', profile.data.avatar_url);
              setCookie('userId', profile.data.id);
              console.log(router.query.redirectUrl as string);
              router.push(router.query.redirectUrl as string);
          }).catch((error) => {
              setIsLogining(false);
              console.log(error);
          });
      }
  }, [router]);

  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome to Community
          </Typography>
          <Box
            marginY={8}
            padding={5}
          >
              {
                  isLogining ?
                  (
                    <CircularProgress />
                  ) :
                  (
                    <Button
                      variant="contained"
                      onClick={() => router.push(githubAuthUrl)}
                      sx={{ backgroundColor: 'black!important' }}
                    >
                      <GitHub />
                      login with github
                    </Button>
                  )
              }
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
