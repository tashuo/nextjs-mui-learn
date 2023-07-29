import { commonRequest } from "./axios"

export const createComment = async (post: number, content: string, parent = 0) => {
    const response = await commonRequest.post('/api/comment', { post, content, parent });
    return response.data;
}

export const getComments = async (post: number, cursor = 0, limit = 10) => {
    const response = await commonRequest.get(`/api/comment?post=${post}&cursor=${cursor}&limit=${limit}`);
    return response.data;
}

export const getChildenComments = async (parent: number, cursor = 0, limit = 10) => {
    const response = await commonRequest.get(`/api/comment/children?parent=${parent}&cursor=${cursor}&limit=${limit}`);
    return response.data;
}