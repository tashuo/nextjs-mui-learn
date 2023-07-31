import { CommentInfo, CursorPaginationData } from "../lib/types";
import { commonRequest } from "./axios"

export const createComment = async (post: number, content: string, parent = 0): Promise<{data: CommentInfo}> => {
    const response = await commonRequest.post('/api/comment', { post, content, parent });
    return response.data;
}

export const getComments = async (post: number, cursor = 0, limit = 10): Promise<{data: CursorPaginationData<CommentInfo>}> => {
    const response = await commonRequest.get(`/api/comment?post=${post}&cursor=${cursor}&limit=${limit}`);
    return response.data;
}

export const getChildenComments = async (parent: number, cursor = 0, limit = 10): Promise<{data: CursorPaginationData<CommentInfo>}> => {
    const response = await commonRequest.get(`/api/comment/children?parent=${parent}&cursor=${cursor}&limit=${limit}`);
    return response.data;
}

export async function likeComment(commentId: number) {
    const response = await commonRequest.post('/api/comment/like', { comment: commentId });
    return response.data;
}

export async function cancelLikeComment(commentId: number) {
    const response = await commonRequest.post('/api/comment/cancelLike', { comment: commentId });
    return response.data;
}