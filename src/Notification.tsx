import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { Notice } from "../lib/types";
import { isNil } from "lodash";
import { useRouter } from "next/router";

export default function Notification({ notice }: { notice: Notice }) {
    const router = useRouter();
    const redirectToPost = () => {
        router.push(`/post/${notice.post?.id}?redirectUrl=${encodeURIComponent(router.asPath)}`);
        return;
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
            direction='row'
            spacing={2}
            width='100%'
            marginY={2}
        >
            <Avatar src={notice.operator.avatar_url} />
            <Stack
                direction='row'
                justifyContent='space-between'
                width='100%'
            >
                <Stack>
                    <Typography
                        component="div"
                        fontSize={14}
                        fontWeight={7}
                        className="my-auto"
                    >
                        {notice.operator.username}
                    </Typography>
                    <Typography
                        component='div'
                        fontSize={14}
                        fontWeight={5}
                        className="line-clamp-2"
                    >
                        {content}
                    </Typography>
                </Stack>
                {
                    notice.type === 'follow'
                    ? (
                        <Typography
                            component='div'
                            marginY='auto'
                        >
                            {notice.created_at_friendly}
                        </Typography>
                    ) : (
                        <Button onClick={redirectToPost}>
                            查看
                        </Button>
                    )
                }
            </Stack>
        </Stack>
    );
}