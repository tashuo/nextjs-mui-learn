import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CardList } from './Card';
import { CircularProgress, Divider, LinearProgress, Pagination, Stack } from '@mui/material';
import { getCollectPosts, getLikePosts, getPosts } from '../api/post';
import { Feed, PaginationData, UserProfileData } from '../lib/types';
import { useInfiniteScroll } from '../lib/hooks';
import { uniqBy } from 'lodash';

export default function ProfileTabs({ userProfile }: { userProfile: UserProfileData }) {
  const [value, setValue] = React.useState('user');
  const [userPosts, setUserPosts] = React.useState<PaginationData<Feed>>({
    items: new Array<Feed>(),
    meta: {
      limit: 12,
      nextPage: 1,
      totalPages: 10,
    }
  });
  const [likePosts, setLikePosts] = React.useState<PaginationData<Feed>>({
    items: new Array<Feed>(),
    meta: {
      limit: 12,
      nextPage: 1,
      totalPages: 10,
    }
  });
  const [collectPosts, setCollectPosts] = React.useState<PaginationData<Feed>>({
    items: new Array<Feed>(),
    meta: {
      totalPages: 12,
      limit: 10,
      nextPage: 1,
    }
  });

  console.log(collectPosts);

  const pageReducer = (state: { user: number, like: number, collect: number }, action: { type: string }) => {
    console.log(action.type);
    switch (action.type) {
        case 'user':
            console.log(state.user, userPosts.meta);
            return { ...state, user: userPosts.meta.nextPage || state.user};
        case 'like':
            console.log(state.like, likePosts.meta);
            return { ...state, like: likePosts.meta.nextPage || state.like };
        case 'collect':
            console.log(state.collect, collectPosts.meta);
            return { ...state, collect: collectPosts.meta.nextPage || state.collect };
        default:
            return state;
    }
  }
  const [ pager, pagerDispacth ] = React.useReducer(pageReducer, { user: 1, like: 1, collect: 1 });
  React.useEffect(() => {
    console.log(`fetching ${value}`);
    console.log(pager);
    const fetchData = async () => {
        switch (value) {
          case 'like':
            likePosts.meta.isLoading = true;
            setLikePosts(likePosts);
            const likeResponse = await getLikePosts(userProfile.id, pager.like);
            setLikePosts({
              ...likeResponse.data,
              items: uniqBy(likePosts.items.concat(likeResponse.data.items.map((v) => v.post)), 'id'),
            });
            break;
          case 'collect':
            collectPosts.meta.isLoading = true;
            setCollectPosts(collectPosts);
            const collectResponse = await getCollectPosts(userProfile.id, 0, pager.collect);
            setCollectPosts({
              ...collectResponse.data,
              items: uniqBy(collectPosts.items.concat(collectResponse.data.items.map((v) => v.post)), 'id'),
            });
            break;
          case 'user':
          default:
            userPosts.meta.isLoading = true;
            setCollectPosts(userPosts);
            const userResponse = await getPosts(userProfile.id, pager.user);
            setUserPosts({
              ...userResponse.data,
              items: uniqBy(userPosts.items.concat(userResponse.data.items), 'id')
            });
            break;
        }
    };
    fetchData();
  }, [value, pager.user, pager.like, pager.collect]);

  const bottomRefreshRef = React.useRef(null);
  useInfiniteScroll(bottomRefreshRef, () => pagerDispacth({
    type: value,
  }), [value as unknown as never]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className='mt-2'>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="帖子" value="user" />
            <Tab label="收藏" value="collect" />
            <Tab label="点赞" value="like" />
          </TabList>
        </Box>
        <TabPanel value="user">
            <div
              className='sm:columns-2 lg:columns-3 gap-8'
            >
                <CardList items={userPosts.items} />
            </div>
            {
                userPosts.meta.nextPage > 0 ? 
                userPosts.meta.isLoading !== undefined ?
                (<Box className='flex justify-center py-5'><CircularProgress /></Box>) 
                : (<LinearProgress ref={bottomRefreshRef} />)
                : (
                  <Box paddingY={5}>
                    <Divider className='font-thin text-sm'>我也是有底线的xdddd</Divider>
                  </Box>
                )
            }
        </TabPanel>
        <TabPanel value="collect">
            <div
              className='sm:columns-2 lg:columns-3 gap-8'
            >
                <CardList items={collectPosts.items} />
            </div>
            {
                collectPosts.meta.nextPage > 0 ? 
                collectPosts.meta.isLoading !== undefined ?
                (<Box className='flex justify-center py-5'><CircularProgress /></Box>)
                : (<LinearProgress ref={bottomRefreshRef} />) 
                : (
                  <Box paddingY={5}>
                    <Divider className='font-thin text-sm'>我也是有底线的xdddd</Divider>
                  </Box>
                )
            }
        </TabPanel>
        <TabPanel value="like">
            <div
              className='sm:columns-2 lg:columns-3 gap-8'
            >
                <CardList items={likePosts.items} />
            </div>
            {
                likePosts.meta.nextPage > 0 ? 
                likePosts.meta.isLoading !== undefined ?
                (<Box className='flex justify-center py-5'><CircularProgress /></Box>)
                : (<LinearProgress ref={bottomRefreshRef} />) 
                : (
                  <Box paddingY={5}>
                    <Divider className='font-thin text-sm'>我也是有底线的xdddd</Divider>
                  </Box>
                )
            }
        </TabPanel>
      </TabContext>
    </div>
  );
}
