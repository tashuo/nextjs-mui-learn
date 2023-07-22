import Axios from 'axios';
import { isBrowser } from '../lib/helper';
export const commonRequest = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    timeout: 3000,
    // withCredentials: true,
});

commonRequest.interceptors.request.use(
  config => {
    if (isBrowser()) {
      const token = localStorage.getItem('bearerToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  err => {
    console.log(err);
    return Promise.reject(err);
  }
);

commonRequest.interceptors.response.use(function (response) {
    return response;
}, function (error) {
  // if (isBrowser()) {
    console.log(`axios response failed: ${error}`);
    console.log(error);
  // }
  return Promise.reject(error);
});