import { ArrowBack } from "@mui/icons-material";
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import FollowButton from "../FollowButton";
import { useRouter } from "next/router";
import { PostInfo } from "../../lib/types";
import { getItemFromLocalStorage, isLogin } from "../../lib/helper";
import { follow, getProfile, unfollow } from "../../api/user";
import * as React from 'react';

export default function PostDetailBar({ post }: { post: PostInfo }) {
    const [isAuthor, setIsAuthor] = React.useState(true);
    const [isFollowing, setIsFollowing] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const clientLoginUserId = getItemFromLocalStorage('userId');
        setIsAuthor(parseInt(clientLoginUserId) === post.user.id);

        isLogin() && getProfile(post.user.id).then((profile) => {
            setIsFollowing(profile.data.interactionInfo.isFollowing);
        });
    }, []);

    const handleFollow = async () => {
        if (!isLogin()) {
            router.push(`/signIn?redirectUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }
        const response = isFollowing ? await unfollow(post.user.id) : await follow(post.user.id);
        setIsFollowing(!isFollowing);
    }

    return (
        <Box flexGrow={1}>
            <AppBar
                position="fixed"
                color="inherit"
                className="shadow-none"
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                        onClick={() => router.back()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography
                        noWrap
                        component='div'
                        sx={{ display: 'flex', overflow: 'inherit' }}
                    >
                        <Avatar
                            aria-label="recipe" 
                            alt={post.user.username} 
                            src={post.user.avatar_url} 
                            onClick={() => router.push(`/user/${post.user.id}`)}
                            sx={{ width: 24, height: 24 }}
                        ></Avatar>
                        <div
                            className="font-normal px-1"
                        >
                            {post.user.username}
                        </div>
                    </Typography>
                    {
                        !isAuthor 
                        && (
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <FollowButton isFollowing={isFollowing} clickCallback={handleFollow} />
                            </Box>
                        )
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}