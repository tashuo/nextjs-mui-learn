import { CursorPaginationData, Notice } from "../lib/types";
import { commonRequest } from "./axios";

export const getNotices = async (type: string, cursor: number, limit = 10): Promise<CursorPaginationData<Notice>> => {
    const response = await commonRequest.get(`/notice?type=${type}&cursor=${cursor}&limit=${limit}`);
    return response?.data;
}

export const markNoticeRead = async (type: string) => {
    const response = await commonRequest.post('/notice/markRead', { type });
    return response?.data;
}

export const getNoticeSummary = async () => {
    const response = await commonRequest.get('/notice/summary');
    return response?.data;
}