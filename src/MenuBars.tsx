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
        {/* <HideOnScroll> */}
          <AppBar position="fixed" color="inherit" className='shadow-none'>
            <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
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
            </Box></div>) : (<div><Button component={Link} color="inherit" href={signInUrl}>Login</Button></div>)}
            </Toolbar>
          </AppBar>
        {/* </HideOnScroll> */}
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </>
  );
}
