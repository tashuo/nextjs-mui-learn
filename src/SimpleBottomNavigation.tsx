import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Paper } from '@mui/material';
import { Home, Notifications, Person } from '@mui/icons-material';
import { useRouter } from 'next/router';

const getUriFromNavValue = (value: number): string => {
  switch (value) {
    case 1:
      return '/notifications';
    case 2:
      return '/user';
    default:
      return '/';
  }
}

const getCurrentNavValueFromUri = (): number => {
  switch (useRouter().pathname) {
    case '/notifications':
      return 1;
    case '/user':
      return 2;
    default:
      return 0;
  }
}

export default function SimpleBottomNavigation() {
  const router = useRouter();
  const currentValue = getCurrentNavValueFromUri();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const uri = getUriFromNavValue(newValue);
    router.push(uri, undefined, { shallow: true });
  };

  return (
    <Box sx={{ pb: 7 }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentValue}
            onChange={handleChange}
          >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Notification" icon={<Notifications />} />
            <BottomNavigationAction label="Me" icon={<Person />} />
          </BottomNavigation>
      </Paper>
    </Box>
  );
}
