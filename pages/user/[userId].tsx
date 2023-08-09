import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../src/Layout";
import Profile from "../../src/Profile";
import ProfileTabs from "../../src/ProfileTab";
import { getAllUserids, getProfile } from "../../api/user";
import { User, UserProfileData } from "../../lib/types";
import { useRouter } from "next/router";
import { useUser } from "../../lib/hooks";
import { Backdrop, CircularProgress } from "@mui/material";

export default function UserProfile() {
    const router = useRouter();
    const userId = router.query.userId;

    // todo 使用skeleton
    const {data, error, isLoading} = useUser(parseInt(userId as string));
    if (isLoading || error) {
        console.log(error);
        return (
            <Backdrop
              sx={{ color: '#ccc', backgroundColor: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
        );
    }
    const user = data as UserProfileData;
    return (
        <Layout>
            <Profile userProfile={user}/>
            <ProfileTabs userProfile={user}/>
        </Layout>
    );
}
