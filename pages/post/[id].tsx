import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GetStaticPaths, GetStaticProps } from "next";
import { PostInfo, CommentInfo, PaginationData } from "../../lib/types";
import { cancelLike, getAllPostIds, getPostInfo, like } from "../../api/post";
import { AppBar, Avatar, Box, Button, Container, FormControl, IconButton, Input, InputAdornment, InputBase, Pagination, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { AddToPhotos, ArrowBack, Comment, Favorite, Send } from "@mui/icons-material";
import Slider from "react-slick";
import { pink } from '@mui/material/colors';
import * as React from "react";
import { useRouter } from "next/router";
import { createComment, getComments } from "../../api/comment";
import { CommentNode } from "../../src/CommentNode";
import { isNil } from 'lodash';

export default function PostDetail({ post }: { post: PostInfo }) {
    const [isLiked, setIsLiked] = React.useState(post.isLiked);
    const [likeCount, setLikeCount] = React.useState(post.like_count);
    const [comments, setComments] = React.useState<PaginationData<CommentInfo>>({
        items: new Array<CommentInfo>(),
        meta: {
          totalPages: 10,
        }
    });
    const [commentPage, setCommentPage] = React.useState(1);
    const [commentPlaceholder, setCommentPlaceholder] = React.useState('请发表您的想法...');
    const [avatar, setAvatar] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [showCommentPost, setShowCommentPost] = React.useState(false);
    const [replyComment, setReplyComment] = React.useState<null | CommentInfo>(null);
    const commentRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();
    const contentMarginTop = post.image_urls.length > 0 ? 5 : 10;
    React.useEffect(() => {
        setAvatar(localStorage.getItem('avatar') as string);
        setNickname(localStorage.getItem('nickname') as string);
        console.log(commentRef?.current?.value);
        const fetchData = async () => {
            const response = await getComments(post.id, commentPage);
            console.log(commentPage, response);

            if (response.data.items.length > 0) {
                setComments(response.data);
            } else {
                console.log('no more comments.items');
            }
        };
        fetchData();
    }, [ isLiked, likeCount, commentPage ]);

    const handleLike = async () => {
        const response = isLiked ? await cancelLike(post.id) : await like(post.id);
        if (response.data) {
          setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);  // todo 应该同步接口的返回
          setIsLiked(!isLiked);
        }
    }

    const AvatarClick = (userId: number) => {
        console.log(userId);
        router.push(`/user/${userId}`);
    }

    const handleCommentPublish = async () => {
        const comment = commentRef?.current?.value;
        if (isNil(comment)) {
            console.log('please input your comment');
            return;
        }
        const response = await createComment(post.id, comment, replyComment ? replyComment.id : 0);
        setReplyComment(null);
        if (!isNil(commentRef.current)) {
            commentRef.current.value = '';
        }
        const newComment = response.data as CommentInfo;
        console.log(replyComment, newComment);
        const newCommentParentId = newComment.parent?.id;
        if (isNil(newCommentParentId)) {
            console.log([newComment].concat(comments.items));
            setComments({
                items: [newComment].concat(comments.items),
                meta: comments.meta,
            });
            return;
        }

        const newComments = comments.items.map((v: CommentInfo) => {
            let isCurrentBranch = false;
            if (v.id === newComment.parent?.id) {
                isCurrentBranch = true;
            }
            isCurrentBranch || v.children?.forEach((c: CommentInfo) => {
                if (c.id === newComment.parent?.id) {
                    console.log(`match ${c.id}`);
                    isCurrentBranch = true;
                }
            });
            return isCurrentBranch ? Object.assign(v, { children: isNil(v.children) ? [newComment] : [newComment].concat(v.children) }) : v;
        });
        console.log(newComments);
        setComments({
            items: newComments,
            meta: comments.meta,
        });
    }

    const toolbar = (
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
                    sx={{ display: 'flex' }}
                >
                    <Avatar 
                        aria-label="recipe" 
                        alt={post.user.username} 
                        src={post.user.avatar_url} 
                        onClick={() => AvatarClick(post.user.id)}
                        sx={{ width: 24, height: 24 }}
                    ></Avatar>
                    <div
                        className="font-normal px-1"
                    >
                        {post.user.username}
                    </div>
                </Typography>
                <Box>
                    <Button>
                        关注
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );

    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // adaptiveHeight: true
    };
    const imageSlider = post.image_urls.length > 0 ?  (
        <Container sx={{ mt: 8, width: '100%', backgroundColor: '#eee', alignContent: 'center' }}>
            <Slider {...settings}>
                {post.image_urls.map((v: string, k) => (
                    <div className="w-full">
                        <img
                          key={k}
                          src={v}
                          srcSet={v}
                          alt={k.toString()}
                          loading="lazy"
                          className="h-auto max-w-md mx-auto"
                        />
                    </div>
                ))}
            </Slider>
        </Container>
    ) : '';

    return (
        <Container
            disableGutters
            maxWidth={false}
            className="overflow-hidden"
        >
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>this is title</title>
            </Head>
            <Box flexGrow={1}>
                {toolbar}
            </Box>
            {imageSlider}
            <Box sx={{ mt: contentMarginTop, mx: 4.5, position: 'relative' }}>
                <Typography
                    variant="body1"
                    component="div"
                    py={2}
                >
                    {post.content}
                </Typography>
                <Typography
                    variant="body2"
                    component="div"
                    fontSize={12}
                    fontWeight={5}
                    pb={2}
                    sx={{ borderBottom: 1, borderBottomColor: '#eee' }}
                >
                    {post.created_at_friendly}
                </Typography>
            </Box>
            <Box
                sx={{ width: '100%' }}
            >
                <Typography
                    variant="body1"
                    component="div"
                    fontSize={14}
                    fontWeight={8}
                    mt={1}
                    mx={4.5}
                >
                    共有xx条评论
                </Typography>
            </Box>
            {
                comments.items.length > 0 && (
                    <Box sx={{ mt: 1, mb: 20, width: '100%', position: 'relative', px: 4.5 }}>
                        <Box>
                            { 
                                comments.items.map(
                                    (comment: CommentInfo) => (
                                        <CommentNode key={comment.id} comment={comment} handleClick={(comment: CommentInfo) => setReplyComment(comment)} />
                                    )
                                ) 
                            }
                        </Box>
                        <Stack spacing={{ xs: 1, sm: 2 }} marginTop="30px" alignItems="center">
                          <Pagination size='medium' count={comments.meta?.totalPages} onChange={(event, newPage: number) => setCommentPage(newPage)}></Pagination>
                        </Stack>
                    </Box>
                )
            }
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
                            placeholder={replyComment ? `回复 @${replyComment.user.username}` : commentPlaceholder}
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
        </Container>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const allPostIds = await getAllPostIds();
    return {
        paths: allPostIds.data.map((v: number) => ({
            params: {id: v.toString()}
        })),
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const response = await getPostInfo(params?.id as string);
    return {
        props: {
            post: response.data
        },
    }
}
