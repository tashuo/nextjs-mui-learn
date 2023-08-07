import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../src/Layout";
import Profile from "../../src/Profile";
import ProfileTabs from "../../src/ProfileTab";
import { getAllUserids, getProfile } from "../../api/user";
import { UserProfileData } from "../../lib/types";

export default function UserProfile({ userProfile }: { userProfile: UserProfileData }) {
    return (
        <Layout>
            <Profile userProfile={userProfile}/>
            <ProfileTabs userProfile={userProfile}/>
        </Layout>
    );
}

export const getStaticPaths: GetStaticPaths = () => {
    // const allUserIds = await getAllUserids();
    console.log(Array.from({ length: 10 }, (v, k) => k + 1).map((v: number) => ({
        params: {id: v.toString()}
    })));
    return {
        // paths: allUserIds.data.map((v: number) => ({
        //     params: {userId: v.toString()}
        // })),
        paths: Array.from({ length: 1000000 }, (v, k) => k + 1).map((v: number) => ({
            params: {userId: v.toString()}
        })),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const user = await getProfile(params?.userId as string)
    return {
        props: {
            userProfile: user.data
        },
    }
}