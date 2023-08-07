import { GetStaticPaths, GetStaticProps } from "next";
import { CommentInfo, PostInfo } from "../../lib/types";
import { getAllPostIds, getPostInfo, like } from "../../api/post";
import CommentList from "../../src/CommentList";
import PostDetail from "../../src/post/PostDetail";
import * as React from 'react';
import { Container } from "@mui/material";
import Head from "next/head";
import PostDetailBar from "../../src/post/PostDetailBar";
import PostDetailBottom from "../../src/post/PostDetailBottom";

export default function Detail({ post }: { post: PostInfo }) {
    const [replyComment, setReplyComment] = React.useState<null | CommentInfo>(null);
    const [newComment, setNewComment] = React.useState<CommentInfo|null>(null);

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
            <PostDetailBar post={post} />
            <PostDetail post={post} />
            <CommentList post={post} replyFunc={handleCommentClick} newComment={newComment} />
            <PostDetailBottom post={post} replyComment={replyComment} publishFunc={handleCommentPublish} />
        </Container>
    );
}

export const getStaticPaths: GetStaticPaths = () => {
    // 这玩意儿在build时就确定了？服了，那新增的id不全GG
    // const allPostIds = await getAllPostIds();
    return {
        // paths: allPostIds.data.map((v: number) => ({
        //     params: {id: v.toString()}
        // })),
        paths: Array.from({ length: 1000000 }, (v, k) => k + 1).map((v: number) => ({
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
