import { commonRequest } from "./axios"

export const createComment = async (post: number, content: string, parent = 0) => {
    const response = await commonRequest.post('/api/comment', { post, content, parent });
    return response.data;
}

export const getComments = async (post: number, page = 1, limit = 10) => {
    const response = await commonRequest.get(`/api/comment?post=${post}&page=${page}&limit=${limit}`);
    return response.data;
}

export const getChildenComments = async (parent: number, page = 1, limit = 10) => {
    const response = await commonRequest.get(`/api/comment/children?parent=${parent}&page=${page}&limit=${limit}`);
    return response.data;
}