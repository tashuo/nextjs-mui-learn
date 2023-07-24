import { commonRequest } from "./axios";

export async function getRecommends(page = 1, limit = 10) {
    const response = await commonRequest.get(`/post?page=${page}&limit=${limit}`);
    return response.data;
}

export async function getFeeds(page = 1, limit = 10) {
    const response = await commonRequest.get(`/feed/list?page=${page}&limit=${limit}`);
    return response.data;
}

export async function like(postId: number) {
    const response = await commonRequest.post('/post/like', { post: postId });
    return response.data;
}

export async function cancelLike(postId: number) {
    const response = await commonRequest.post('/post/cancelLike', { post: postId });
    return response.data;
}

export async function getPosts(userId?: number, page = 1, limit = 10) {
    const response = await commonRequest.get(`/post?user=${userId ? userId : ''}&page=${page}&limit=${limit}`);
    return response.data;
}

export async function getLikePosts(userId: number, page = 1, limit = 10) {
    const response = await commonRequest.get(`/post/likes?user=${userId}&page=${page}&limit=${limit}`);
    return response.data;
}

export async function getCollectPosts(userId: number, collectId ?: number, page = 1, limit = 10) {
    const response = await commonRequest.get(`/post/collects?user=${userId}&collect=${collectId ? collectId : ''}&page=${page}&limit=${limit}`);
    return response.data;
}