import { AddToPhotos, CollectionsBookmarkOutlined, Comment, Favorite, FavoriteBorder, FavoriteOutlined, ModeCommentOutlined, Send } from "@mui/icons-material";
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

    const commentButtonClick = () => {
        setCurrentReplyComment(null);
        commentRef.current?.focus();
    }

    return (
        <Box 
            sx={{ 
                width: '100%', 
                position: 'fixed', 
                bottom: 0,
                paddingBottom: { xs: 'env(safe-area-inset-bottom)', sm: 0 },
                background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderTopLeftRadius: { xs: 0, sm: 16 },
                borderTopRightRadius: { xs: 0, sm: 16 },
                boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.08)',
                zIndex: 1,
            }}
        >
            <Stack
                spacing={1}
                sx={{
                    maxWidth: 'lg',
                    margin: '0 auto',
                    width: '100%',
                    py: 1,
                }}
            >
                <Stack 
                    direction='row' 
                    sx={{ 
                        px: { xs: 2, sm: 4 },
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        <div className='flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-full transition-all'>
                            <IconButton 
                                size="small"
                                aria-label="like" 
                                onClick={handleLike}
                                sx={{
                                    color: isLiked ? pink[500] : 'inherit',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {isLiked ? <FavoriteOutlined /> : <FavoriteBorder />}
                            </IconButton>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ minWidth: 20 }}
                            >
                                {likeCount}
                            </Typography>
                        </div>

                        <div className='flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-full transition-all'>
                            <IconButton
                                size="small"
                                aria-label="comment"
                                onClick={commentButtonClick}
                            >
                                <ModeCommentOutlined />
                            </IconButton>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ minWidth: 20 }}
                            >
                                {post.comment_count}
                            </Typography>
                        </div>

                        <div className='flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-full transition-all'>
                            <IconButton
                                size="small"
                                aria-label="collect"
                            >
                                <CollectionsBookmarkOutlined />
                            </IconButton>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ minWidth: 20 }}
                            >
                                {post.collect_count}
                            </Typography>
                        </div>
                    </Stack>
                </Stack>

                <Box sx={{ px: { xs: 2, sm: 4 } }}>
                    <Paper
                        component="form"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            p: '4px 12px',
                            borderRadius: '24px',
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            transition: 'all 0.3s',
                            border: '1px solid transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            },
                            '&:focus-within': {
                                backgroundColor: '#fff',
                                borderColor: (theme) => theme.palette.primary.main,
                                boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
                            }
                        }}
                        elevation={0}
                    >
                        <Avatar 
                            src={avatar} 
                            alt={nickname} 
                            sx={{ 
                                width: 32, 
                                height: 32,
                                mr: 1,
                            }} 
                        />
                        <InputBase
                            sx={{ 
                                flex: 1,
                                fontSize: '0.95rem',
                                '& input': {
                                    padding: '8px 0',
                                }
                            }}
                            placeholder={currentReplyComment ? `回复 @${currentReplyComment.user.username}` : commentPlaceholder}
                            inputProps={{ 'aria-label': commentPlaceholder }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setShowCommentPost(e.target.value !== '')
                            }}
                            inputRef={commentRef}
                        />
                        {showCommentPost && (
                            <IconButton 
                                color="primary" 
                                sx={{ 
                                    ml: 1,
                                    backgroundColor: (theme) => theme.palette.primary.main,
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.primary.dark,
                                    }
                                }} 
                                size="small"
                                onClick={handleCommentPublish}
                            >
                                <Send sx={{ fontSize: 18 }} />
                            </IconButton>
                        )}
                    </Paper>
                </Box>
            </Stack>
        </Box>
    );
}