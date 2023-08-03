import { AxiosProgressEvent } from "axios";
import { commonRequest } from "./axios";
import { UserProfileData } from "../lib/types";

export async function register(username: string, password: string) {
    const response = await commonRequest.post('/api/user/register', {username, password});
    return response.data;
}

export async function login(username: string, password: string) {
    const response = await commonRequest.post('/api/user/login', {username, password});
    return response.data;
}

export async function githubLogin(code: string) {
    const response = await commonRequest.post('/api/user/githubLogin', {code});
    return response.data;
}

export async function getProfile(userId?: string | number): Promise<{data: UserProfileData}> {
    const response = await commonRequest.get(`/api/user/profile${userId ? `/${userId}` : ''}`);
    return response.data;
}

// todo 干掉这傻逼路由逻辑
export async function getAllUserids() {
    const response = await commonRequest.get('/api/user/all');
    return response.data;
}

export async function follow(userId: number) {
    const response = await commonRequest.post('/api/user/follow', { userId });
    return response.data;
}

export async function unfollow(userId: number) {
    const response = await commonRequest.post('/api/user/unfollow', { userId });
    return response.data
}

export async function uploadFiles(files: File[], onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) {
    const formData = new FormData();
    files.map((file: File) => {
        formData.append('files', file);
    });
    const config = onUploadProgress ? {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        onUploadProgress: onUploadProgress
    } : {
        headers: {
            "Content-Type": "multipart/form-data"
        },
    };
    const response = await commonRequest.post('/api/user/uploadMulti', formData, config);
    return response.data;
}
