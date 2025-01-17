import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Badge, BadgeProps, CircularProgress, Divider, LinearProgress, styled } from '@mui/material';
import { CursorPaginationData, Notice } from '../lib/types';
import { useInfiniteScroll } from '../lib/hooks';
import { uniqBy } from 'lodash';
import { getNoticeSummary, getNotices, markNoticeRead } from '../api/notice';
import Notification from './Notification';

const StyledDivider = styled(Divider)(({ theme }) => ({
  '&.MuiDivider-root': {
    '&::before, &::after': {
      borderColor: theme.palette.grey[200],
    },
    fontSize: '0.875rem',
    color: theme.palette.grey[500],
    margin: theme.spacing(3, 0),
    textTransform: 'none',
    letterSpacing: '0.5px',
    '&:hover': {
      color: theme.palette.grey[700],
      transition: 'color 0.3s ease',
    }
  }
}));

const NoMoreContent = () => (
  <Box 
    paddingY={3} 
    display="flex" 
    flexDirection="column" 
    alignItems="center"
    gap={2}
  >
    <StyledDivider>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        opacity: 0.8
      }}>
        <span className="material-icons" style={{ fontSize: '1rem' }}>
          mood
        </span>
        到底啦
      </Box>
    </StyledDivider>
  </Box>
);

export default function NotificationTabs() {
  const [value, setValue] = React.useState('like');
  const [unreadCount, setUnreadCount] = React.useState({
      like: 0,
      comment: 0,
      follow: 0,
  });
  console.log(unreadCount);
  const initPaginationData = {
    items: new Array<Notice>(),
    meta: {
      limit: 12,
      cursor: 0,
      hasMore: true,
    }
  };
  const [comments, setComments] = React.useState<CursorPaginationData<Notice>>(initPaginationData);
  const [likes, setLikes] = React.useState<CursorPaginationData<Notice>>(initPaginationData);
  const [follows, setFollows] = React.useState<CursorPaginationData<Notice>>(initPaginationData);
  const [loadNewData, setLoadNewData] = React.useState(false);
  React.useEffect(() => {
    console.log(`fetching ${value}`);
    const fetchData = async () => {
        switch (value) {
          case 'like':
            likes.meta.isLoading = true;
            setLikes(likes);
            const likeResponse = await getNotices(value, likes.meta.cursor);
            setLikes({
              ...likeResponse,
              items: uniqBy(likes.items.concat(likeResponse.items), 'id'),
            });
            break;
          case 'comment':
            comments.meta.isLoading = true;
            setComments(comments);
            const commentResponse = await getNotices(value, comments.meta.cursor);
            setComments({
              ...commentResponse,
              items: uniqBy(comments.items.concat(commentResponse.items), 'id'),
            });
            break;
          case 'follow':
          default:
            follows.meta.isLoading = true;
            setFollows(follows);
            const followResponse = await getNotices(value, follows.meta.cursor);
            setFollows({
              ...followResponse,
              items: uniqBy(follows.items.concat(followResponse.items), 'id'),
            });
            break;
        }
    };
    fetchData();
    if ((value === 'like' || value === 'comment' || value === 'follow')) {
      unreadCount[value] = 0;
    }
    setUnreadCount(unreadCount);
  }, [value, loadNewData]);

  React.useEffect(() => {
      markNoticeRead(value);
  }, [value]);

  React.useEffect(() => {
      const fetch = async () => {
          const response = await getNoticeSummary();
          console.log(response);
          response.forEach((v: {
              type: string,
              c: number,
          }) => {
              // 默认tab不赋值 
              if (v.type === 'comment' || v.type === 'follow') 
                unreadCount[v.type] = v.c;
          });
          setUnreadCount(unreadCount);
      }
      fetch();
  }, []);

  const bottomRefreshRef = React.useRef(null);
  useInfiniteScroll(bottomRefreshRef, () => setLoadNewData(!loadNewData), [value as unknown as never]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      top: 2,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 2px',
      backgroundColor: 'red',
      color: 'white',
      minWidth: '15px',
      height: '15px',
    },
  }));

  return (
    <div className='mt-14'>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider', position: 'fixed', width: '100%', backgroundColor: '#fff', borderBottom: 1, borderBottomColor: '#e0e0e0', zIndex: 1 }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab 
              label={
                <StyledBadge
                  badgeContent={unreadCount.like}
                >
                  获赞
                </StyledBadge>
              } 
              value="like" 
            />
            <Tab 
              label={
                <StyledBadge
                  badgeContent={unreadCount.comment}
                >
                  评论
                </StyledBadge>
              }
              value="comment" 
            />
            <Tab 
              label={
                <StyledBadge
                  badgeContent={unreadCount.follow}
                >
                  新增关注
                </StyledBadge>
              }
              value="follow" 
            />
          </TabList>
        </Box>
        <TabPanel value="like" sx={{ marginTop: { xs: 4, sm: 5 } }}>
            <Box>
                {
                    likes.items.map((v: Notice) => (<Notification key={v.id} notice={v} />))
                }
            </Box>
            {
                likes.meta.hasMore ? 
                likes.meta.isLoading !== undefined ?
                (<Box className='flex justify-center py-5'><CircularProgress /></Box>) 
                : (<LinearProgress ref={bottomRefreshRef} />)
                : <NoMoreContent />
            }
        </TabPanel>
        <TabPanel value="comment" sx={{ marginTop: { xs: 4, sm: 5 } }}>
            <Box>
                {
                    comments.items.map((v: Notice) => (<Notification key={v.id} notice={v} />))
                }
            </Box>
            {
                comments.meta.hasMore ? 
                comments.meta.isLoading !== undefined ?
                (<Box className='flex justify-center py-5'><CircularProgress /></Box>) 
                : (<LinearProgress ref={bottomRefreshRef} />)
                : <NoMoreContent />
            }
        </TabPanel>
        <TabPanel value="follow" sx={{ marginTop: { xs: 4, sm: 5 } }}>
            <Box>
                {
                    follows.items.map((v: Notice) => (<Notification key={v.id} notice={v} />))
                }
            </Box>
            {
                follows.meta.hasMore ? 
                follows.meta.isLoading !== undefined ?
                (<Box className='flex justify-center py-5'><CircularProgress /></Box>)
                : (<LinearProgress ref={bottomRefreshRef} />) 
                : <NoMoreContent />
            }
        </TabPanel>
      </TabContext>
    </div>
  );
}
