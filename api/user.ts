import { commonRequest } from "./axios";

export async function register(username: string, password: string) {
    const response = await commonRequest.post('/user/register', {username, password});
    return response.data;
}

export async function login(username: string, password: string) {
    const response = await commonRequest.post('/user/login', {username, password});
    return response.data;
}

export async function getProfile(userId?: string) {
    const response = await commonRequest.get(`/user/profile${userId ? `/${userId}` : ''}`);
    return response.data;
}

export async function getAllUserids() {
    const response = await commonRequest.get('/user/all');
    return response.data;
}

export async function follow(userId: number) {
    const response = await commonRequest.post('/user/follow', { userId });
    return response.data;
}

export async function unfollow(userId: number) {
    const response = await commonRequest.post('/user/unfollow', { userId });
    return response.data;
}