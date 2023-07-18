import { isNil } from 'lodash';
import { io } from 'socket.io-client';
import { isBrowser } from './helper';

export const wsConnect = () => {
    console.log('wsConnect');
    if (isBrowser()) {
        const token = localStorage.getItem('bearerToken');
        if (isNil(token)) {
            return;
        }
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
            return socket;
        } catch (e) {
            console.log('connect failed');
            console.log(e);
        }
    } else {
        console.log('ws in server');
    }
}