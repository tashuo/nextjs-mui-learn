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
        <div className="flex flex-col mt-8 px-4 py-6 mx-auto items-center bg-white rounded-lg shadow-sm 
            sm:flex-row sm:mx-8 md:mx-14 lg:mx-20 sm:px-8 sm:py-10 transition-all duration-300 hover:shadow-md">
            <Avatar 
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-purple-100" 
                src={userProfile.avatar_url || 'https://mui.com/static/images/avatar/4.jpg'} 
                alt={`${userProfile.username}的头像`}
            />
            <div className="mt-6 w-full sm:mt-0 sm:ml-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="text-center sm:text-left">
                        <div className="text-2xl md:text-3xl leading-tight font-bold text-gray-900 hover:text-purple-600 transition-colors">
                            {userProfile.username}
                        </div>
                        <div className="text-sm text-gray-500 py-1">
                            ID: {userProfile.id}
                        </div>
                    </div>
                    {!isSelf && (
                        <div className="mt-4 sm:mt-0" onClick={handleFollow}>
                            {isFollowing ? (
                                <button className="w-full sm:w-auto px-6 py-2 text-base text-gray-600 font-semibold rounded-full border-2 
                                    border-gray-200 hover:text-white hover:bg-gray-600 hover:border-transparent transition-all duration-200">
                                    取消关注
                                </button>
                            ) : (
                                <button className="w-full sm:w-auto px-6 py-2 text-base text-purple-600 font-semibold rounded-full border-2 
                                    border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent transition-all duration-200">
                                    关注
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-4 text-base text-gray-600 line-clamp-2 text-center sm:text-left">
                    {userProfile.description || '暂无介绍'}
                </div>
                <div className="text-purple-500 text-sm py-2 text-center sm:text-left">
                    {userProfile.gender}
                </div>
                <div className="text-base flex justify-center sm:justify-start space-x-8 mt-4 pb-2">
                    <div className="flex flex-col items-center sm:flex-row sm:items-baseline hover:text-purple-600 transition-colors cursor-pointer">
                        <span className="font-semibold text-lg">{userProfile.interactionInfo.followingCount}</span>
                        <span className="text-gray-600 sm:ml-2">关注</span>
                    </div>
                    <div className="flex flex-col items-center sm:flex-row sm:items-baseline hover:text-purple-600 transition-colors cursor-pointer">
                        <span className="font-semibold text-lg">{userProfile.interactionInfo.followerCount}</span>
                        <span className="text-gray-600 sm:ml-2">粉丝</span>
                    </div>
                    <div className="flex flex-col items-center sm:flex-row sm:items-baseline hover:text-purple-600 transition-colors cursor-pointer">
                        <span className="font-semibold text-lg">{userProfile.interactionInfo.receivedLikeCount}</span>
                        <span className="text-gray-600 sm:ml-2">获赞</span>
                    </div>
                </div>
            </div>
        </div>
    );
}