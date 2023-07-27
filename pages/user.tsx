import { GetServerSideProps, GetStaticProps } from "next";
import Layout from "../src/Layout";
import Profile from "../src/Profile";
import ProfileTabs from "../src/ProfileTab";
import { UserProfileData } from "../lib/types";

export default function User({ userProfile }: { userProfile: UserProfileData }) {
    return (
        <Layout>
            <Profile userProfile={userProfile}/>
            <ProfileTabs userProfile={userProfile}/>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/profile`, {
        headers: {
            Authorization: `Bearer ${context.req.cookies.token}`,
        },
        method: 'GET',
    });
    const res = await response.json();
    return {
        props: {
            userProfile: res.data,
        }
    }
}