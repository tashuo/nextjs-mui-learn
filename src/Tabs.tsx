import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import StandardImageList from './ImageList';
import { CardList } from './Card';
import { Pagination, Stack } from '@mui/material';
import { getFeeds, getRecommends } from '../api/post';
import { isLogin } from '../lib/helper';
import { useRouter } from 'next/router';
import { PaginationData } from '../lib/types';

export default function LabTabs() {
  const [value, setValue] = React.useState('recommend');
  const [followingData, setFollowingData] = React.useState<PaginationData>({
    items: [],
    meta: {
      totalPages: 10,
    }
  });
  const [recommendData, setRecommendData] = React.useState<PaginationData>({
    items: [],
    meta: {
      totalPages: 10,
    }
  });
  const [followPage, setFollowPage] = React.useState(1);
  const [recommendPage, setRecommendPage] = React.useState(1);
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

  return (
    <Box sx={{ width: '100%', typography: 'body1', my: 8 }}>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Following" value="following" />
            <Tab label="Recommend" value="recommend" />
          </TabList>
        </Box>
        <TabPanel value="following">
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="space-evenly">
                <CardList items={followingData.items} />
            </Stack>
            <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
              <Pagination size='large' count={followingData.meta?.totalPages} onChange={handlePageChange}></Pagination>
            </Stack>
        </TabPanel>
        <TabPanel value="recommend">
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="space-evenly">
                <CardList items={recommendData.items} />
            </Stack>
            <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
              <Pagination size='large' count={recommendData.meta?.totalPages} onChange={handlePageChange}></Pagination>
            </Stack>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
