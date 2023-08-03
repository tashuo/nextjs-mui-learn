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
      nextPage: 2,
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
  const [hasMoreRecommend, setHasMoreRecommend] = React.useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = React.useState(true);
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
  const [ pager, pagerDispacth ] = React.useReducer(pageReducer, { recommend: 0, following: 1 });
  React.useEffect(() => {
    console.log('fetching');
    console.log(pager);
    const fetchData = async () => {
        if (value === 'recommend') {
          if (pager.recommend === 0) {
              return;
          }
          const newRecommends = (await getRecommends(pager.recommend)).data;
          setRecommendData({
            ...newRecommends,
            items: uniqBy(recommendData.items.concat(newRecommends.items), 'id'),
          });
          setHasMoreRecommend(newRecommends.meta.nextPage > 0);
        } else if (isLogin()) {
          const newFollowings = (await getFeeds(pager.following)).data;
          pager.following > 0 && setFollowingData({
              ...newFollowings,
              items: uniqBy(followingData.items.concat(newFollowings.items), 'id'),
          });
          setHasMoreFollowing(newFollowings.meta.nextPage > 0);
        } else {
            router.push(`/signIn?redirectUrl=${encodeURIComponent('/')}`);
        }
    };
    fetchData();
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
        <Box sx={{ borderColor: 'divider', position: 'fixed', width: '100%', backgroundColor: '#fff', marginTop: -2, borderBottom: 1, borderBottomColor: '#e0e0e0', zIndex: 1 }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Following" value="following" />
            <Tab label="Recommend" value="recommend" />
          </TabList>
          { publishProcess === 1 && (<LinearProgress color="success" style={{ marginTop: '-2px' }} />)}
        </Box>
        <PullToRefresh onRefresh={handlePullRefresh} className='mt-6' pullingContent=''>
          <TabPanel value="following">
            <div
              className='sm:columns-2 lg:columns-3 gap-8'
            >
              <CardList items={followingData.items} />
            </div>
            {
                hasMoreFollowing ? 
                (<Box className='flex justify-center py-5' ref={bottomRefreshRef}><CircularProgress /></Box>) 
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
                  hasMoreRecommend 
                  ? (<Box className='flex justify-center py-5' ref={bottomRefreshRef}><CircularProgress /></Box>) 
                  : (
                    <Box paddingY={5}>
                      <Divider className='font-thin text-sm'>我也是有底线的xdddd</Divider>
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
