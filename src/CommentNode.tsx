import { useRouter } from "next/router";
import { CommentInfo, CursorPaginationData } from "../lib/types";
import { Avatar, Box, Button, Divider, IconButton, Link, Stack, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Comment, FavoriteBorder, FavoriteOutlined, ModeComment, ModeCommentOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { pink } from "@mui/material/colors";
import { isLogin } from "../lib/helper";
import { cancelLikeComment, getChildenComments, likeComment } from "../api/comment";
import { isNil, uniqBy } from "lodash";

export const BaseCommentNode = ({comment, handleClick, rootCommentId}: {comment: CommentInfo, handleClick: Function, rootCommentId?: number}) => {
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
                <Box>
                    {
                        comment.parent?.id !== rootCommentId
                        && (
                            <>
                                <Typography
                                    variant="body1"
                                    component="span"
                                    fontSize={14}
                                    marginY='auto'
                                >
                                    回复
                                </Typography>
                                <Typography
                                    variant="body2"
                                    component="span"
                                    fontSize={14}
                                    lineHeight='19px'
                                    fontWeight={5}
                                    marginY='auto'
                                    marginLeft='2px'
                                >
                                    {comment.parent?.user.username}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="span"
                                    fontSize={14}
                                    marginY='auto'
                                    marginRight='2px'
                                >
                                    :
                                </Typography>
                            </>
                        )
                    }
                    <Typography
                        variant="body1"
                        component="span"
                        fontSize={14}
                        marginY='auto'
                        overflow='inherit'
                    >
                        {comment.content}
                    </Typography>
                </Box>
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
                                    {liked ? <FavoriteOutlined sx={{ color: pink[500] }} fontSize="small" /> : <FavoriteBorder fontSize="small" />}
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
                                <IconButton aria-label="reply" onClick={(event: React.MouseEvent<HTMLElement>) => { event.stopPropagation(); handleClick(comment)}}>
                                    <ModeCommentOutlined fontSize="small" />
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

export const CommentNode = ({comment, handleClick, newChildComment}: {comment: CommentInfo, handleClick: Function, newChildComment?: CommentInfo}) => {
    const [childrenComments, setChildrenComments] = useState<CursorPaginationData<CommentInfo>>({
        items: comment?.children || new Array<CommentInfo>(),
        meta: {
            limit: 10,
            cursor: comment.children?.at(-1)?.id || 0,
            hasMore: true,
        }
    });

    useEffect(() => {
        console.log(newChildComment);
        if (isNil(newChildComment)) {
            return;
        }

        setChildrenComments({
            ...childrenComments,
            items: uniqBy([newChildComment].concat(childrenComments.items), 'id'),
        });
    }, [ newChildComment ]);

    const leftCommentsCount = childrenComments.meta.hasMore ? (comment.interaction_info.reply_count - childrenComments.items.length) : 0;

    const loadComments = async () => {
        const response = await getChildenComments(comment.id, childrenComments.meta.cursor);
        setChildrenComments({
            ...response.data,
            items: uniqBy(childrenComments.items.concat(response.data.items), 'id'),
        });
    }

    return (
        <Box sx={{ width: '100%' }}>
            <BaseCommentNode key={comment.id} comment={comment} handleClick={handleClick} />
            {
                childrenComments.items.length > 0 
                && (
                    <Box
                        sx={{ marginLeft: '24px' }}
                    >
                        {
                            childrenComments.items.map((v: CommentInfo) => (
                                <BaseCommentNode key={v.id} comment={v} rootCommentId={comment.id} handleClick={handleClick} />
                            ))
                        }
                    </Box>
                )
            }
            {
                leftCommentsCount > 0
                && (
                    <Button sx={{ marginLeft: '52px', paddingX: 0 }} variant="text" onClick={loadComments}>
                        展开 {leftCommentsCount} 条回复
                    </Button>
                )
            }
            <Divider sx={{ marginLeft: '28px' }} />
        </Box>
    );
}