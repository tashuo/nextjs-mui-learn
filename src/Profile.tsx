import { Avatar, Box } from "@mui/material";
import { getItemFromLocalStorage, isLogin } from "../lib/helper";
import { useRouter } from "next/router";
import { useState } from "react";
import { unfollow, follow } from "../api/user";
import { UserProfileData } from "../lib/types";

export default function Profile({ userProfile }: { userProfile: UserProfileData }) {
    const [isFollowing, setIsFollowing] = useState(userProfile.interactionInfo.isFollowing);
    const router = useRouter();
    const loginUserId = getItemFromLocalStorage('userId');
    const isSelf = parseInt(loginUserId) === userProfile.id;
    console.log(router);
    const handleFollow = async () => {
        if (!isLogin()) {
            router.push(`/signIn?redirectUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }
        const response = isFollowing ? await unfollow(userProfile.id) : await follow(userProfile.id);
        setIsFollowing(!isFollowing);
    }

    return (
        <div className="flex flex-col justify-between mt-8 px-5 py-8 mx-auto items-center sm:flex-row sm:mx-14 sm:px-0">
            <Avatar className="w-1/3 h-full sm:w-1/4" src={userProfile.avatar_url ? userProfile.avatar_url : 'https://mui.com/static/images/avatar/4.jpg'} alt="Woman paying for a purchase"/>
            <div className="mt-4 sm:mt-0 sm:ml-10">
                <div className="flex justify-between">
                    <div className="mt-1">
                        <div className="text-2xl leading-tight font-semibold text-gray-900">{userProfile.username}</div>
                        <div className="text-sm font-thin py-1">
                            id: {userProfile.id}
                        </div>
                    </div>
                    { isSelf || (
                        <div className="mt-1 px-2" onClick={handleFollow}>
                        {
                            isFollowing
                            ? (
                                <button className="px-4 py-1 text-base text-gray-600 font-semibold rounded-full border border-gray-200 hover:text-white hover:bg-gray-600 hover:border-transparent">取消关注</button>
                            )
                            : (
                            <button className="px-4 py-1 text-base text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent">关注</button>
                            )
                        }
                        </div>
                    )}
                </div>
                <div className="mt-1 text-base font-light line-clamp-2">{userProfile.description ? userProfile.description : '暂无介绍'}</div>
                <div className="text-blue-500 text-sm py-2">{userProfile.gender}</div>
                <div className="text-base font-thin flex">
                    <div>
                        <span className="font-medium pr-1">{userProfile.interactionInfo.followingCount}</span>
                        <span>关注</span>
                    </div>
                    <div className="ml-5">
                        <span className="font-medium px-1">{userProfile.interactionInfo.followerCount}</span>
                        <span>粉丝</span>
                    </div>
                    <div className="ml-5">
                        <span className="font-medium px-1">{userProfile.interactionInfo.receivedLikeCount}</span>
                        <span>获赞</span>
                    </div>
                </div>
            </div>
        </div>
    );
}