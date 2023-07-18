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

interface PaginationData {
  items: [],
  meta: {
    total?: number,
    totalPages: number,
    limit?: number,
    nextPage?: number,
  }
}

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

  React.useEffect(() => {
    const fetchData = async () => {
        const response = value === 'recommend' ? await getRecommends(recommendPage) : await getFeeds(followPage);
        if (value === 'recommend') {
            setRecommendData(response.data);
        } else {
            setFollowingData(response.data);
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
            <StandardImageList />
        </TabPanel>
        <TabPanel value="recommend">
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
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
