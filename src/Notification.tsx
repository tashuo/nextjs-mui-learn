import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { Notice } from "../lib/types";
import { isNil } from "lodash";
import { useRouter } from "next/router";

export default function Notification({ notice }: { notice: Notice }) {
    const router = useRouter();
    const redirectToPost = () => {
        if (notice.type === 'follow') return;
        router.push(`/post/${notice.post?.id}?redirectUrl=${encodeURIComponent(router.asPath)}`);
    }

    let content = '';
    switch (notice.type) {
        case 'like':
            if (isNil(notice.post)) {
                break;
            }
            if (!isNil(notice.comment)) {
                content = `点赞了您在动态"${notice.post.content.substring(0, 10)}..."中的评论"${notice.comment.content.substring(0, 15)}..."`;
            } else {
                content = `点赞了您的动态"${notice.post.content.substring(0, 15)}..."`;
            }
            break;
        case 'comment':
            if (isNil(notice.post) || isNil(notice.comment)) {
                break;
            }
            content = `评论了您的动态"${notice.post.content.substring(0, 15)}...", "${notice.comment.content.substring(0, 15)}..."`;
            break;
        case 'follow':
            content = `开始关注你`;
            break;
        default:
            break;
    }

    return (
        <Stack
            onClick={redirectToPost}
            direction='row'
            spacing={2}
            width='100%'
            marginY={1.5}
            padding={2}
            sx={{
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    cursor: notice.type === 'follow' ? 'default' : 'pointer',
                },
            }}
        >
            <Avatar 
                src={notice.operator.avatar_url}
                sx={{ 
                    width: 48, 
                    height: 48,
                    border: '2px solid #f0f0f0' 
                }}
            />
            <Stack
                direction='row'
                justifyContent='space-between'
                width='100%'
                spacing={2}
            >
                <Stack spacing={0.5}>
                    <Typography
                        component="div"
                        fontSize={15}
                        fontWeight={600}
                        sx={{ color: '#1a1a1a' }}
                    >
                        {notice.operator.username}
                    </Typography>
                    <Typography
                        component='div'
                        fontSize={14}
                        sx={{ 
                            color: '#666',
                            lineHeight: 1.5 
                        }}
                        className="line-clamp-2"
                    >
                        {content}
                    </Typography>
                    <Typography
                        component='div'
                        fontSize={12}
                        sx={{ color: '#999' }}
                    >
                        {notice.created_at_friendly}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}