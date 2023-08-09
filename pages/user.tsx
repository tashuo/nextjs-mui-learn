import Layout from "../src/Layout";
import Profile from "../src/Profile";
import ProfileTabs from "../src/ProfileTab";
import { UserProfileData } from "../lib/types";
import { useUser } from "../lib/hooks";
import { Backdrop, CircularProgress } from "@mui/material";

export default function User() {
    // todo 使用skeleton
    const {data, error, isLoading} = useUser();
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
    const userProfile = data as UserProfileData;
    return (
        <Layout>
            <Profile userProfile={userProfile}/>
            <ProfileTabs userProfile={userProfile}/>
        </Layout>
    );
}
