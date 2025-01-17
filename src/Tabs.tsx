import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CardList } from './Card';
import { CircularProgress, Divider, Fab, LinearProgress, Pagination, Stack } from '@mui/material';
import { getFeeds, getRecommends } from '../api/post';
import { isLogin } from '../lib/helper';
import { useRouter } from 'next/router';
import { Feed, PaginationData } from '../lib/types';
import ScrollTop from './ScrollTop';
import AddPostButton from './AddPostButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Create } from '@mui/icons-material';
import PostForm from './post/PostForm';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { uniqBy } from 'lodash';
import { useInfiniteScroll } from '../lib/hooks';

export default function LabTabs() {
  const [value, setValue] = React.useState('recommend');
  const [followingData, setFollowingData] = React.useState<PaginationData<Feed>>({
    items: new Array<Feed>(),
    meta: {
      limit: 12,
      nextPage: 1,
      totalPages: 10,
    }
  });
  const [recommendData, setRecommendData] = React.useState<PaginationData<Feed>>({
    items: new Array<Feed>(),
    meta: {
      limit: 12,
      nextPage: 1,
      totalPages: 10,
    }
  });
  const [showPostForm, setShowPostForm] = React.useState(false);
  const router = useRouter();
  const pageReducer = (state: { recommend: number, following: number }, action: { type: string }) => {
    console.log(action.type);
    switch (action.type) {
        case 'recommend':
            console.log(state.recommend, recommendData.meta);
            return { ...state, recommend: recommendData.meta.nextPage || state.recommend};
        case 'following':
            console.log(state.following, followingData.meta);
            return { ...state, following: followingData.meta.nextPage || state.following };
        default:
            return state;
    }
  }
  const [ pager, pagerDispacth ] = React.useReducer(pageReducer, { recommend: 0, following: 0 });
  React.useEffect(() => {
    console.log(`fetching ${value}`);
    console.log(pager);
    if (value === 'recommend') {
      if (pager.recommend === 0) {
        return;
      }
      recommendData.meta.isLoading = true;
      setRecommendData(recommendData);
      getRecommends(pager.recommend).then((res) => res.data)
      .then((newRecommends) => {
          setRecommendData({
            ...newRecommends,
            items: uniqBy(recommendData.items.concat(newRecommends.items), 'id'),
          });
      }).catch((error) => {
          console.log(error);
      })
    } else if (isLogin()) {
      if (pager.following === 0) {
        return;
      }
      followingData.meta.isLoading = true;
      setFollowingData(followingData);
      getFeeds(pager.following).then((res) => res.data)
        .then((newFollowings) => {
          setFollowingData({
            ...newFollowings,
            items: uniqBy(followingData.items.concat(newFollowings.items), 'id'),
          });
        }).catch((error) => {
            console.log(error);
        })
    } else {
      router.push(`/signIn?redirectUrl=${encodeURIComponent('/')}`);
      return;
    }
  }, [pager.recommend, pager.following ]);

  const bottomRefreshRef = React.useRef(null);
  useInfiniteScroll(bottomRefreshRef, () => pagerDispacth({
      type: value,
  }), [value as unknown as never]);

  const [publishProcess, setPublishProcess] = React.useState(0);
  React.useEffect(() => {
      if (publishProcess === 2) {
          setValue('recommend');
          window.scrollTo({
              top: 0,
              behavior: 'smooth',
          });
          handlePullRefresh();
      }
  }, [publishProcess]);
  const handlePublish = (process: number = 1) => {
      setShowPostForm(false);
      setPublishProcess(process);
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const togglePostForm = (state: boolean = false) => {
      setShowPostForm(state);
  }

  const handlePullRefresh = async () => {
    console.log('refresh');
    if (value === 'recommend') {
        const newRecommends = (await getRecommends()).data;
        setRecommendData({
          ...recommendData,
          items: uniqBy(newRecommends.items.concat(recommendData.items), 'id'),
        });
    } else if (isLogin()) {
        const newFollowings = (await getFeeds()).data;
        setFollowingData({
          ...followingData,
          items: uniqBy(newFollowings.items.concat(followingData.items), 'id'),
        });
    } else {
        router.push(`/signIn?redirectUrl=${encodeURIComponent('/')}`);
    }
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1', mt: 8 }}>
      <TabContext value={value}>
        <Box sx={{ 
          borderColor: 'divider', 
          position: 'fixed', 
          width: '100%', 
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          marginTop: -2, 
          borderBottom: 1, 
          borderBottomColor: 'rgba(0, 0, 0, 0.08)', 
          zIndex: 1,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}>
          <TabList 
            onChange={handleChange} 
            aria-label="content tabs" 
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 500,
                minWidth: 120,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                },
                '&.Mui-selected': {
                  fontWeight: 600,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30%',
                    height: '3px',
                    borderRadius: '3px 3px 0 0',
                    backgroundColor: 'primary.main',
                    transition: 'width 0.2s ease'
                  }
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'  // 隐藏默认的指示器
              }
            }}
          >
            <Tab label="Following" value="following" />
            <Tab label="Recommend" value="recommend" />
          </TabList>
          { publishProcess === 1 && (
            <LinearProgress 
              color="success" 
              sx={{
                marginTop: '-2px',
                height: 2,
                '& .MuiLinearProgress-bar': {
                  backgroundImage: 'linear-gradient(to right, #4CAF50, #81C784)'
                }
              }} 
            />
          )}
        </Box>
        <PullToRefresh onRefresh={handlePullRefresh} className='mt-6' pullingContent=''>
          <TabPanel value="following">
            <div
              className='sm:columns-2 lg:columns-3 gap-8'
            >
              <CardList items={followingData.items} />
            </div>
            {
                followingData.meta.nextPage > 0 ? 
                followingData.meta.isLoading !== undefined ?
                (<Box className='flex justify-center py-5'><CircularProgress /></Box>) 
                : (<LinearProgress ref={bottomRefreshRef} />)
                : (
                  <Box paddingY={5}>
                    <Divider className='font-thin text-sm'>我也是有底线的xdddd</Divider>
                  </Box>
                )
            }
          </TabPanel>
        </PullToRefresh>
        <PullToRefresh onRefresh={handlePullRefresh} className='mt-1' pullingContent=''>
          <TabPanel value="recommend">
              <div
                className='sm:columns-2 lg:columns-3 gap-8'
              >
                  <CardList items={recommendData.items} />
              </div>
              {
                  recommendData.meta.nextPage ?
                  recommendData.meta.isLoading ? 
                  (<Box className='flex justify-center py-5'><CircularProgress /></Box>) 
                  : (<LinearProgress ref={bottomRefreshRef} />)
                  : (
                    <Box paddingY={8} className="flex flex-col items-center">
                      <Divider 
                        sx={{
                          width: '80%',
                          maxWidth: '600px',
                          '&::before, &::after': {
                            borderColor: 'rgba(0, 0, 0, 0.08)',
                          }
                        }}
                      >
                        <span className="px-4 text-sm text-gray-400 font-normal select-none">
                          我也是有底线的 (｡･ω･｡)
                        </span>
                      </Divider>
                    </Box>
                  )
              }
          </TabPanel>
        </PullToRefresh>
      </TabContext>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <AddPostButton setState={togglePostForm}>
        <Fab size="small" aria-label="scroll back to top">
          <Create />
        </Fab>
      </AddPostButton>
      <PostForm isOpen={showPostForm} setState={handlePublish} />
    </Box>
  );
}
