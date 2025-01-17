'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, ListItemIcon } from '@mui/material';
import Router from 'next/router';
import Link from 'next/link';
import { Logout, Settings } from '@mui/icons-material';
import SearchBar from './Search';
import { wsConnect } from '../lib/websocket';
import { clearClientLoginState, isBrowser } from '../lib/helper';
import { useSocketIO } from '../lib/hooks';

export default function PrimarySearchAppBar() {
  const signInUrl = `/signIn?redirectUrl=${encodeURIComponent('/')}`
  const [avatar, setAvatar] = React.useState('');
  React.useEffect(() => {
      setAvatar(localStorage.getItem('avatar') as string);
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    console.log('logout');
    clearClientLoginState();
    Router.reload();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" color="inherit" className='shadow-none'>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{ 
                display: { xs: 'block', sm: 'block' },
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              Community
            </Typography>
            <SearchBar placeholder='Search something...' />
            <Box sx={{ flexGrow: 1 }} />
            {avatar ? (<div><Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar alt="Remy Sharp" src={avatar as string} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <Avatar alt="Remy Sharp" src={avatar as string} />
              </IconButton>
            </Box></div>) : (
              <Box sx={{ 
                ml: { xs: 1, sm: 2 },
                display: 'flex',
                alignItems: 'center'
              }}>
                <Button
                  component={Link}
                  href={signInUrl}
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: { xs: 2, sm: 3 },
                    minWidth: { xs: '70px', sm: '80px' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    height: { xs: '32px', sm: '36px' },
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                >
                  登录
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </>
  );
}
