import Layout from "../src/Layout";
import Profile from "../src/Profile";
import ProfileTabs from "../src/ProfileTab";

export default function User() {
    return (
        <Layout>
            <Profile/>
            <ProfileTabs />
        </Layout>
    );
}