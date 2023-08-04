import { Feed, PaginationData } from "../lib/types";
import { commonRequest } from "./axios";

export async function publish(content: string, images = [], title = '') {
    const response = await commonRequest.post('/post', { title, content, images });
    return response.data;
}

export async function getRecommends(page = 1, limit = 12): Promise<{data: PaginationData<Feed>}> {
    const response = await commonRequest.get(`/post?page=${page}&limit=${limit}`);
    return response.data;
}

export async function getFeeds(page = 1, limit = 12): Promise<{data: PaginationData<Feed>}> {
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

export async function getPosts(userId?: number, page = 1, limit = 12): Promise<{data: PaginationData<Feed>}> {
    const response = await commonRequest.get(`/post?user=${userId ? userId : ''}&page=${page}&limit=${limit}`);
    return response.data;
}

export async function getLikePosts(userId: number, page = 1, limit = 12): Promise<{data: PaginationData<{post: Feed}>}> {
    const response = await commonRequest.get(`/post/likes?user=${userId}&page=${page}&limit=${limit}`);
    return response.data;
}

export async function getCollectPosts(userId: number, collectId ?: number, page = 1, limit = 12): Promise<{data: PaginationData<{post: Feed}>}> {
    const response = await commonRequest.get(`/post/collects?user=${userId}&collect=${collectId ? collectId : ''}&page=${page}&limit=${limit}`);
    return response.data;
}

export async function getPostInfo(postId: string) {
    const response = await commonRequest.get(`/post/${postId}`);
    return response.data;
}

// todo 干掉这傻逼路由逻辑
export async function getAllPostIds() {
    const response = await commonRequest.get('/post/all');
    return response.data;
}