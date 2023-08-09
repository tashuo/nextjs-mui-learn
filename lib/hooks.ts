import { isNil } from 'lodash';
import * as React from 'react';
import { io } from 'socket.io-client';
import { commonRequest } from '../api/axios';
import useSWR, { SWRResponse } from "swr";
import { PostInfo, UserProfileData } from './types';

export const useInfiniteScroll = (scrollRef: React.MutableRefObject<any>, callback: Function, extraListeners = []) => {
    React.useEffect(() => {
        console.log(`init scroll`);
        extraListeners.push(scrollRef as unknown as never);
        const scrollObserver = new IntersectionObserver(entries => {
            console.log(`scrolling`);
            if (entries[0].isIntersecting) {
                callback();
            }
        }, { threshold: 1 });
    
        if (scrollRef.current) {
            scrollObserver.observe(scrollRef.current);
        }
    
        return () => {
          console.log('unmount scroll');
          if (scrollRef.current) {
            scrollObserver.unobserve(scrollRef.current);
          }
        }
    }, [extraListeners])
}

// todo hook化，暴露connect、emit、on等方法
export const useSocketIO = (messageCallbacks?: {
    event: string,
    callback: Function
}[]) => {
    React.useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        if (!isNil(token)) {
            try {
                const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_HOST as string, {
                    autoConnect: true,
                    extraHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                socket.on('connect', function () {
                    console.log('connect');
                });

                messageCallbacks?.map((v) => {
                    console.log(v.event);
                    socket.on(v.event, (message?: any) => {
                        console.log(message);
                        v.callback(message);
                    });
                });

                // 心跳
                const heartbeatInterval = socket ? setInterval(() => {
                  console.log(`heartbeat: ${Date.now()}`);
                  socket.emit('heartbeat', {
                      live: true
                  });
                }, 60000) : null;
                return () => {
                  socket?.disconnect();
                  heartbeatInterval && window.clearInterval(heartbeatInterval);
                  console.log('ws disconnect');
                }
            } catch (e) {
                console.log('connect failed');
                console.log(e);
            }
        }
    }, []);
}

export const usePost = (id: number): SWRResponse<PostInfo> => {
    return useSWR(`/post/${id}`, (api: string) => commonRequest.get(api).then((res) => res.data.data));
}

export const useUser = (id: number): SWRResponse<UserProfileData> => {
    return useSWR(`/user/profile/${id}`, (api: string) => commonRequest.get(api).then((res) => res.data.data));
}
