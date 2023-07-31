import { Box, Button } from "@mui/material";
import { isNil } from "lodash";
import { useRouter } from "next/router";
import { isLogin } from "../lib/helper";

export default function FollowButton({ isFollowing, clickCallback }: { isFollowing: boolean, clickCallback?: Function }) {
    const clickFunc = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isNil(clickCallback)) {
            clickCallback();
        }
    }

    return (
        <Box onClick={clickFunc}>
            {
                isFollowing
                ? (
                    <Button className="px-4 py-1 text-base bg-gray-500 text-white font-semibold rounded-full border border-gray-200 hover:bg-gray-800 hover:border-transparent hover:scale-110 duration-2000">取消关注</Button>
                )
                : (
                <Button className="px-4 py-1 text-base text-white bg-purple-500 font-semibold rounded-full border border-purple-200 hover:bg-purple-800 hover:border-transparent hover:scale-110 duration-2000">关注</Button>
                )
            }
        </Box>
    );
}