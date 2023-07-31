import { AddToPhotos, Comment, Favorite, Send } from "@mui/icons-material";
import { Avatar, Box, IconButton, InputBase, Paper, Stack, Typography } from "@mui/material";
import * as React from 'react';
import { cancelLike, like } from "../../api/post";
import { CommentInfo, PostInfo } from "../../lib/types";
import { pink } from "@mui/material/colors";
import { getItemFromLocalStorage, isLogin } from "../../lib/helper";
import { createComment } from "../../api/comment";
import { isNil } from 'lodash';
import { useRouter } from "next/router";

export default function PostDetailBottom({ post, replyComment, publishFunc }: { post: PostInfo, replyComment: CommentInfo | null, publishFunc: Function }) {
    console.log(`PostDetailBottom render with replyment: ${replyComment?.id}`);
    const [isLiked, setIsLiked] = React.useState(post.isLiked);
    const [likeCount, setLikeCount] = React.useState(post.like_count);
    const [avatar, setAvatar] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [commentPlaceholder, setCommentPlaceholder] = React.useState('请发表您的想法...');
    const [showCommentPost, setShowCommentPost] = React.useState(false);
    const [currentReplyComment, setCurrentReplyComment] = React.useState(replyComment);
    const commentRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();

    React.useEffect(() => {
        setCurrentReplyComment(replyComment);
    }, [replyComment]);

    React.useEffect(() => {
        setAvatar(getItemFromLocalStorage('avatar'));
        setNickname(getItemFromLocalStorage('nickname'));
    }, []);

    const handleCommentPublish = async () => {
        const comment = commentRef?.current?.value;
        if (isNil(comment)) {
            console.log('please input your comment');
            return;
        }
        const response = await createComment(post.id, comment, currentReplyComment ? currentReplyComment.id : 0);
        setCurrentReplyComment(null);
        if (!isNil(commentRef.current)) {
            commentRef.current.value = '';
        }
        publishFunc(response.data);
        // const newComment = response.data as CommentInfo;
        // console.log(currentReplyComment, newComment);
        // const newCommentParentId = newComment.parent?.id;
        // if (isNil(newCommentParentId)) {
        //     console.log([newComment].concat(comments.items));
        //     setComments({
        //         items: [newComment].concat(comments.items),
        //         meta: comments.meta,
        //     });
        //     return;
        // }

        // const newComments = comments.items.map((v: CommentInfo) => {
        //     let isCurrentBranch = false;
        //     if (v.id === newComment.parent?.id) {
        //         isCurrentBranch = true;
        //     }
        //     isCurrentBranch || v.children?.forEach((c: CommentInfo) => {
        //         if (c.id === newComment.parent?.id) {
        //             console.log(`match ${c.id}`);
        //             isCurrentBranch = true;
        //         }
        //     });
        //     return isCurrentBranch ? Object.assign(v, { children: isNil(v.children) ? [newComment] : [newComment].concat(v.children) }) : v;
        // });
        // console.log(newComments);
        // setComments({
        //     items: newComments,
        //     meta: comments.meta,
        // });
    }

    const handleLike = async () => {
        if (!isLogin()) {
            router.push(`/signIn?redirectUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }

        const response = isLiked ? await cancelLike(post.id) : await like(post.id);
        if (response.data) {
          setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);  // todo 应该同步接口的返回
          setIsLiked(!isLiked);
        }
    }

    return (
        <Box sx={{ width: '100%', position: 'fixed', bottom: 0, alignContent: 'center', backgroundColor: '#fff', zIndex: 1, borderTop: 1, borderTopColor: '#ddd' }}>
            <Stack
                spacing={2}
            >
                <Stack direction='row' sx={{ marginTop: 1, px: 2 }}>
                    <div className='flex px-2'>
                      <IconButton aria-label="add to favorites" onClick={handleLike}>
                        {isLiked ? <Favorite sx={{ color: pink[500] }} /> : <Favorite />}
                      </IconButton>
                      <Typography color="text.secondary" className='mx-auto my-auto'>{likeCount}</Typography>
                    </div>
                    <div className='flex px-2'>
                      <IconButton aria-label="comment">
                        <Comment />
                      </IconButton>
                      <Typography color="text.secondary" className='mx-auto my-auto'>{post.comment_count}</Typography>
                    </div>
                    <div className='flex px-2'>
                      <IconButton aria-label="collect">
                        <AddToPhotos />
                      </IconButton>
                      <Typography color="text.secondary" className='mx-auto my-auto'>{post.collect_count}</Typography>
                    </div>
                </Stack>
                <Box
                    sx={{ px: 4, pb: 2 }}
                >
                    <Paper
                      component="form"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <Avatar src={avatar} alt={nickname} sx={{ width: 30, height: 30 }} />
                      </IconButton>
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={currentReplyComment ? `回复 @${currentReplyComment.user.username}` : commentPlaceholder}
                        inputProps={{ 'aria-label': commentPlaceholder }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setShowCommentPost(e.target.value !== '')
                        }}
                        inputRef={commentRef}
                      />
                      {
                          showCommentPost
                          && (
                            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={handleCommentPublish}>
                                <Send />
                            </IconButton>
                          )
                      }
                    </Paper>
                </Box>
            </Stack>
        </Box>
    );
}