import { GetStaticPaths, GetStaticProps } from "next";
import { CommentInfo, Feed, PostInfo } from "../../lib/types";
import { getAllPostIds, getPostInfo, like } from "../../api/post";
import CommentList from "../../src/CommentList";
import PostDetail from "../../src/post/PostDetail";
import * as React from 'react';
import { Backdrop, Box, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import PostDetailBar from "../../src/post/PostDetailBar";
import PostDetailBottom from "../../src/post/PostDetailBottom";
import { useRouter } from "next/router";
import { isNil } from "lodash";
import { commonRequest } from "../../api/axios";
import useSWR from "swr";
import { usePost } from "../../lib/hooks";

export default function Detail() {
    const router = useRouter();
    const postId = router.query.id;
    console.log(postId, router);
    const [replyComment, setReplyComment] = React.useState<null | CommentInfo>(null);
    const [newComment, setNewComment] = React.useState<CommentInfo|null>(null);

    // todo 使用skeleton
    const {data, error, isLoading} = usePost(parseInt(postId as string));
    if (isLoading || error) {
        console.log(error);
        return (
            <Backdrop
              sx={{ color: '#ccc', backgroundColor: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    const handleCommentPublish = (publishedComment: CommentInfo) => {
        console.log(publishedComment);
        setReplyComment(null);
        setNewComment(publishedComment);
    }

    const handleCommentClick = (comment: CommentInfo) => {
        console.log(`receive click ${comment.id}`);
        setReplyComment(comment);
    }

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
            <PostDetailBar post={data} />
            <PostDetail post={data} />
            <CommentList post={data} replyFunc={handleCommentClick} newComment={newComment} />
            <PostDetailBottom post={data} replyComment={replyComment} publishFunc={handleCommentPublish} />
        </Container>
    );
}