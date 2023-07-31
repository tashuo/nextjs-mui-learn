import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { CommentInfo, CursorPaginationData, PostInfo } from "../lib/types";
import * as React from "react";
import { getComments } from "../api/comment";
import { isNil, uniqBy } from "lodash";
import { CommentNode } from "./CommentNode";

export default function CommentList({ post, replyFunc, newComment }: { post: PostInfo, replyFunc: Function, newComment?: CommentInfo | null }) {
    console.log(newComment);
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
            if (response.data.items.length > 0) {
                setComments({
                    ...response.data,
                    items: uniqBy(comments.items.concat(response.data.items), 'id'),
                });
            } else {
                console.log('no more comments.items');
            }
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
                    ? (<Box className='flex justify-center py-5' ref={bottomRefreshRef}><CircularProgress /></Box>)
                    : (<Box paddingY={5}>
                        <Divider className='font-thin text-sm'>我也是有底线的xdddd</Divider>
                      </Box>)
                }
            </Box>
        </Box>
    );
}