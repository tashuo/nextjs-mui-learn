import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Badge, BadgeProps, Paper, styled } from '@mui/material';
import { Home, Notifications, Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSocketIO } from '../lib/hooks';
import { getNoticeSummary } from '../api/notice';

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
  const [noticeCount, setNoticeCount] = React.useState(0);
  useSocketIO([
    {
        event: 'notification',
        callback: (message: number) => {
          console.log(message);
          router.pathname !== '/notifications' && setNoticeCount(message);
        },
    }, {
      event: 'newNotification',
      callback: (message: boolean) => {
        console.log(message);
        router.pathname !== '/notifications' && setNoticeCount((v) => v + 1);
      },
    }
  ]);
  
  const currentValue = getCurrentNavValueFromUri();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const uri = getUriFromNavValue(newValue);
    router.push(uri, undefined, { shallow: true });
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      top: 3,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      backgroundColor: 'red',
      color: 'white',
    },
  }));

  return (
    <Box sx={{ pb: 7 }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentValue}
            onChange={handleChange}
          >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Notification" icon={<StyledBadge badgeContent={noticeCount}><Notifications /></StyledBadge>} />
            <BottomNavigationAction label="Me" icon={<Person />} />
          </BottomNavigation>
      </Paper>
    </Box>
  );
}
