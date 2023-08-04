import Axios from 'axios';
import { clearClientLoginState, getItemFromLocalStorage, isBrowser } from '../lib/helper';
import Router from 'next/router';
export const commonRequest = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    timeout: 50000,
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
    console.log(`axios response failed: ${error}`);
    console.log(error);
    if (error.response?.status === 401) {
        clearClientLoginState();
        Router.push(`/signIn?redirectUrl=${encodeURIComponent(Router.asPath)}`);
    }
    
    return Promise.reject(error);
});