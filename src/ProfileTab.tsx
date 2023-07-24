import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CardList } from './Card';
import { Pagination, Stack } from '@mui/material';
import { getCollectPosts, getLikePosts, getPosts } from '../api/post';
import { PaginationData, UserProfileData } from '../lib/types';

export default function ProfileTabs({ userProfile }: { userProfile: UserProfileData }) {
  const [value, setValue] = React.useState('post');
  const [userPosts, setUserPosts] = React.useState<PaginationData>({
    items: [],
    meta: {
      totalPages: 10,
    }
  });
  const [likePosts, setLikePosts] = React.useState<PaginationData>({
    items: [],
    meta: {
      totalPages: 10,
    }
  });
  const [collectPosts, setCollectPosts] = React.useState<PaginationData>({
    items: [],
    meta: {
      totalPages: 10,
    }
  });
  const [userPage, setUserPage] = React.useState(1);
  const [likePage, setLikePage] = React.useState(1);
  const [collectPage, setCollectPage] = React.useState(1);

  React.useEffect(() => {
    const fetchData = async () => {
        let response = null;
        switch (value) {
          case 'like':
            response = await getLikePosts(userProfile.id, likePage);
            setLikePosts(response.data);
            break;
          case 'collect':
            response = await getCollectPosts(userProfile.id, 0, collectPage);
            setCollectPosts(response.data);
            break;
          case 'post':
          default:
            response = await getPosts(userProfile.id, userPage);
            setUserPosts(response.data);
            break;
        }
    };
    fetchData();
  }, [value, userPage, likePage, collectPage]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handlePageChange = (event: any, newPage: number) => {
    switch (value) {
      case 'like':
        setLikePage(newPage);
        break;
      case 'collect':
        setCollectPage(newPage);
        break;
      case 'post':
      default:
        setUserPage(newPage)
        break;
    }
  }

  return (
    <div className='mt-2'>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="帖子" value="post" />
            <Tab label="收藏" value="collect" />
            <Tab label="点赞" value="like" />
          </TabList>
        </Box>
        <TabPanel value="post">
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="space-evenly">
                <CardList items={userPosts.items} />
            </Stack>
            <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
              <Pagination size='large' count={userPosts.meta.totalPages} onChange={handlePageChange}></Pagination>
            </Stack>
        </TabPanel>
        <TabPanel value="collect">
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="space-evenly">
                <CardList items={collectPosts.items.map((v: any) => v.post)} />
            </Stack>
            <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
              <Pagination size='large' count={collectPosts.meta.totalPages} onChange={handlePageChange}></Pagination>
            </Stack>
        </TabPanel>
        <TabPanel value="like">
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="space-evenly">
                <CardList items={likePosts.items.map((v: any) => v.post)} />
            </Stack>
            <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
              <Pagination size='large' count={likePosts.meta.totalPages} onChange={handlePageChange}></Pagination>
            </Stack>
        </TabPanel>
      </TabContext>
    </div>
  );
}
