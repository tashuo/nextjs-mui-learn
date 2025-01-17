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
import { Card, CircularProgress, Link, Stack } from '@mui/material';
import { getProfile, githubLogin } from '../api/user';
import { setCookie } from 'cookies-next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function SignIn() {
  const [isLogining, setIsLogining] = React.useState(false);
  const router = useRouter();
  const code = router.query.code as string;
  const redirectUrl = encodeURIComponent(router.query.redirectUrl as string ?? '/');
  const githubRedirectUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/signIn?redirectUrl=${redirectUrl}`);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectUrl}`;
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
    <Container component="main" maxWidth="xs" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      pb: 8,
      background: 'radial-gradient(ellipse at top, rgba(243, 246, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
    }}>
      <CssBaseline />
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        mt: -8,
        gap: 3,
      }}>
        <Link
          href="/"
          sx={{
            textDecoration: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1a1a1a',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              textAlign: 'center',
            }}
          >
            Community
          </Typography>
        </Link>
        <Card 
          variant="outlined" 
          sx={{ 
            width: '100%', 
            p: 4,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(230, 235, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 400
              }}
            >
              Join our developer community
            </Typography>
            {
              isLogining ? (
                <CircularProgress size={28} sx={{ color: 'primary.main' }} />
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => router.push(githubAuthUrl)}
                  sx={{ 
                    backgroundColor: 'black!important',
                    py: 1.5,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#333!important',
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease-in-out',
                    }
                  }}
                >
                  <GitHub sx={{ mr: 1 }} />
                  Login with GitHub
                </Button>
              )
            }
          </Box>
        </Card>
      </Box>
      <Copyright sx={{ 
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: 0.8
      }} />
    </Container>
  );
}
