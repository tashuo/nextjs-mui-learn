import { commonRequest } from "./axios";

export async function register(username: string, password: string) {
    const response = await commonRequest.post('/user/register', {username, password});
    return response.data;
}

export async function login(username: string, password: string) {
    const response = await commonRequest.post('/user/login', {username, password});
    return response.data;
}

export async function getProfile() {
    const response = await commonRequest.get('/user/profile');
    return response.data;
}