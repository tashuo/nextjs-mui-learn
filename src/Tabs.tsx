import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CardList, FeedCard } from './Card';
import { Fab, Pagination, Stack } from '@mui/material';
import { getFeeds, getRecommends } from '../api/post';
import { isLogin } from '../lib/helper';
import { useRouter } from 'next/router';
import { Feed, PaginationData } from '../lib/types';
import ScrollTop from './ScrollTop';
import AddPostButton from './AddPostButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Create } from '@mui/icons-material';
import PostForm from './PostForm';

export default function LabTabs() {
  const [value, setValue] = React.useState('recommend');
  const [followingData, setFollowingData] = React.useState<PaginationData<Feed>>({
    items: new Array<Feed>(),
    meta: {
      totalPages: 10,
    }
  });
  const [recommendData, setRecommendData] = React.useState<PaginationData<Feed>>({
    items: new Array<Feed>(),
    meta: {
      totalPages: 10,
    }
  });
  const [followPage, setFollowPage] = React.useState(1);
  const [recommendPage, setRecommendPage] = React.useState(1);
  const [showPostForm, setShowPostForm] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
        if (value === 'recommend') {
            setRecommendData((await getRecommends(recommendPage)).data);
        } else if (isLogin()) {
            setFollowingData((await getFeeds(followPage)).data);
        } else {
            router.push(`/signIn?redirectUrl=${encodeURIComponent('/')}`);
        }
    };
    fetchData();
  }, [value, followPage, recommendPage]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handlePageChange = (event: any, newPage: number) => {
    if (value === 'recommend') {
      setRecommendPage(newPage);
    } else {
      setFollowPage(newPage);
    }
  }

  const togglePostForm = (state: boolean = false) => {
      setShowPostForm(state);
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1', my: 8 }}>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider', position: 'fixed', width: '100%', backgroundColor: '#fff', marginTop: -2, borderBottom: 1, borderBottomColor: '#e0e0e0', zIndex: 1 }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Following" value="following" />
            <Tab label="Recommend" value="recommend" />
          </TabList>
        </Box>
        <TabPanel value="following" sx={{ marginTop: 3 }}>
          <div
            className='sm:columns-2 lg:columns-3 gap-8'
          >
            <CardList items={followingData.items} />
          </div>
          <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
              <Pagination size='medium' count={followingData.meta?.totalPages} onChange={handlePageChange}></Pagination>
          </Stack>
        </TabPanel>
        <TabPanel value="recommend" sx={{ marginTop: 3 }}>
            <div
              className='sm:columns-2 lg:columns-3 gap-8'
            >
                <CardList items={recommendData.items} />
            </div>
            <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
              <Pagination size='medium' count={recommendData.meta?.totalPages} onChange={handlePageChange}></Pagination>
            </Stack>
        </TabPanel>
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
      <PostForm isOpen={showPostForm} setState={togglePostForm} />
    </Box>
  );
}
