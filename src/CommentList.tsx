import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { CommentInfo, CursorPaginationData, PostInfo } from "../lib/types";
import * as React from "react";
import { getComments } from "../api/comment";
import { isNil, uniqBy } from "lodash";
import { CommentNode } from "./CommentNode";
import { useRouter } from "next/router";
import { usePost } from "../lib/hooks";

export default function CommentList({ post, replyFunc, newComment }: { post: PostInfo, replyFunc: Function, newComment?: CommentInfo | null }) {
    console.log(newComment);
    const router = useRouter();
    const postId = router.query.id;
    const {data, error, isLoading} = usePost(parseInt(postId as string));
    if (isLoading) {
        return (
            <Box>
                loading
            </Box>
        );
    }
    const [comments, setComments] = React.useState<CursorPaginationData<CommentInfo>>({
        items: new Array<CommentInfo>(),
        meta: {
            limit: 12,
            cursor: 0,
            hasMore: true,
        }
    });

    const [newChildComment, setNewChildComment] = React.useState<CommentInfo | null>(null);
    React.useEffect(() => {
        console.log(newComment);
        if (isNil(newComment)) {
            return;
        }

        // 根评论
        const newCommentParentId = newComment?.parent?.id;
        if (isNil(newCommentParentId)) {
            console.log([newComment].concat(comments.items));
            setComments({
                items: uniqBy([newComment].concat(comments.items), 'id'),
                meta: comments.meta,
            });
            return;
        }

        setNewChildComment(newComment);
    }, [newComment]);

    const [loadNewData, setLoadNewData] = React.useState(false);
    React.useEffect(() => {
        const fetchData = async () => {
            console.log('fetching');
            console.log(comments.meta);
            const response = await getComments(post.id, comments.meta.cursor);
            console.log(response.data);
            setComments({
                ...response.data,
                items: uniqBy(comments.items.concat(response.data.items), 'id'),
            });
        };
        fetchData();
    }, [ loadNewData ]);

    const bottomRefreshRef = React.useRef(null);
    React.useEffect(() => {
      console.log(`init scroll`);
      console.log(comments.meta);
      console.log(bottomRefreshRef.current);
      const scrollObserver = new IntersectionObserver(entries => {
          console.log(`scrolling`);
          console.log(entries[0]);
          if (entries[0].isIntersecting) {
                // todo 优雅方案
                setLoadNewData((v) => !v);  // 反复横跳，有无更优雅的方案？
          }
      }, { threshold: 1 });

      if (bottomRefreshRef.current) {
          scrollObserver.observe(bottomRefreshRef.current);
      }

      return () => {
        console.log('unmount scroll');
        if (bottomRefreshRef.current) {
          scrollObserver.unobserve(bottomRefreshRef.current);
        }
      }
    }, [bottomRefreshRef]);

    const handleCommentClick = (comment: CommentInfo) => {
        console.log(`click ${comment.id}`);
        replyFunc(comment);
    }

    return (
        <Box>
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
                    共有{post.comment_count}条评论
                </Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 20, width: '100%', position: 'relative', px: 4.5 }}>
                <Box>

                    { 
                        comments.items.map(
                            (comment: CommentInfo) => (
                                <CommentNode key={comment.id} comment={comment} newChildComment={newChildComment?.mpath?.substring(0, newChildComment?.mpath?.indexOf('.')) === comment.id.toString() ? newChildComment : undefined} handleClick={(comment: CommentInfo) => handleCommentClick(comment)} />
                            )
                        ) 
                    }
                </Box>
                {
                    comments.meta.hasMore
                    ? (<Box 
                        className='flex justify-center py-5' 
                        ref={bottomRefreshRef}
                    >
                        <CircularProgress size={30}
                            sx={{ color: 'primary.main' }}
                        />
                    </Box>)
                    : (<Box 
                        paddingY={3}
                        sx={{
                            animation: 'fadeIn 0.5s ease-in',
                            '@keyframes fadeIn': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateY(20px)'
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateY(0)'
                                }
                            }
                        }}
                    >
                        <Divider>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    backgroundColor: 'background.paper',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        transition: 'transform 0.2s ease'
                                    }
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontSize: { xs: 11, sm: 13 },
                                        fontWeight: 500,
                                        letterSpacing: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <span role="img" aria-label="star" style={{ fontSize: '1.2em' }}>✨</span>
                                    已经到底啦
                                    <span role="img" aria-label="cute" style={{ fontSize: '1.2em' }}>(｡◕‿◕｡)</span>
                                </Typography>
                            </Box>
                        </Divider>
                    </Box>)
                }
            </Box>
        </Box>
    );
}