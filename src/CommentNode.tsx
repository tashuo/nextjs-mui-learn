import { useRouter } from "next/router";
import { CommentInfo, CursorPaginationData } from "../lib/types";
import { Avatar, Box, Divider, IconButton, Link, Stack, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Comment } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { pink } from "@mui/material/colors";
import { isLogin } from "../lib/helper";
import { cancelLikeComment, getChildenComments, likeComment } from "../api/comment";

export const BaseCommentNode = ({comment, handleClick}: {comment: CommentInfo, handleClick: Function}) => {
    const [liked, setLiked] = useState(comment.interaction_info.liked);
    const [likeCount, setLikeCount] = useState(comment.interaction_info?.like_count || 0);
    const router = useRouter();

    const handleLike = async () => {
        if (!isLogin()) {
            router.push(`/signIn?redirectUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }

        const response = liked ? await cancelLikeComment(comment.id) : await likeComment(comment.id);
        if (response.data) {
          setLikeCount(liked ? likeCount - 1 : likeCount + 1);  // todo 应该同步接口的返回
          setLiked(!liked);
        }
    }

    return (
        <Stack
            direction='row'
            spacing={0.5}
            mt={2}
            onClick={(event: React.MouseEvent<HTMLElement>) => { event.stopPropagation(); handleClick(comment)}}
        >
            <Avatar
                alt={comment.user.username}
                sx={{ width: 24, height: 24 }}
                src={comment.user.avatar_url}
            />
            <Stack
                spacing={1}
                sx={{ width: '100%' }}
            >
                <Typography
                    variant="body2"
                    component="div"
                    fontSize={14}
                    lineHeight='19px'
                    fontWeight={5}
                    className="my-auto"
                >
                    {comment.user.username}
                </Typography>
                <Typography
                    variant="body1"
                    component="div"
                    pb={1}
                    fontSize={14}
                >
                    {comment.mpath + '|' + comment.content}
                </Typography>
                <Stack
                    spacing={2}
                >
                    <Stack
                        direction='row'
                        spacing={2}
                        justifyContent='space-between'
                        fontSize={10}
                        lineHeight={12}
                    >
                        <Typography
                            variant="body2"
                            component="div"
                            className='my-auto'
                        >
                            {comment.created_at_friendly}
                        </Typography>
                        <Stack
                            direction='row'
                            spacing={2}
                        >
                            <Stack
                                direction='row'
                                spacing={0}
                            >
                                <IconButton aria-label="add to favorites" onClick={handleLike}>
                                    {liked ? <FavoriteIcon sx={{ color: pink[500] }} fontSize="small" /> : <FavoriteIcon fontSize="small" />}
                                </IconButton>
                                <Typography
                                    component="div"
                                    className='mx-auto my-auto'
                                >
                                    {likeCount}
                                </Typography>
                            </Stack>
                            <Stack
                                direction='row'
                                spacing={0}
                            >
                                <IconButton aria-label="add to favorites" onClick={handleLike}>
                                    <Comment fontSize="small" />
                                </IconButton>
                                <Typography
                                    component="div"
                                    className='mx-auto my-auto'
                                >
                                    {comment.interaction_info.reply_count}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export const CommentNode = ({comment, handleClick}: {comment: CommentInfo, handleClick: Function}) => {
    const [childrenComments, setChildrenComments] = useState<CursorPaginationData<CommentInfo>>({
        items: comment?.children || new Array<CommentInfo>(),
        meta: {
            limit: 10,
            cursor: comment.children?.at(-1)?.id || 0,
            hasMore: true,
        }
    });
    if (comment.id === 565) {
        console.log('comment node render');
        console.log(childrenComments);
    }

    const leftCommentsCount = childrenComments.meta.hasMore ? (comment.interaction_info.reply_count - childrenComments.items.length) : 0;

    const loadComments = async () => {
        const response = await getChildenComments(comment.id, childrenComments.meta.cursor);
        setChildrenComments({
            ...response.data,
            items: childrenComments.items.concat(response.data.items),
        });
    }

    return (
        <Box sx={{ width: '100%' }}>
            <BaseCommentNode comment={comment} handleClick={handleClick} />
            {
                childrenComments.items.length > 0 
                && (
                    <Box
                        sx={{ marginLeft: '24px' }}
                    >
                        {
                            childrenComments.items.map((v: CommentInfo) => (
                                <BaseCommentNode comment={v} handleClick={handleClick} />
                            ))
                        }
                    </Box>
                )
            }
            {
                leftCommentsCount > 0
                && (
                    <Link sx={{ marginLeft: '52px' }} underline="none" onClick={loadComments}>
                        展开剩余{leftCommentsCount}回复
                    </Link>
                )
            }
            <Divider sx={{ marginLeft: '28px' }} />
        </Box>
    );
}