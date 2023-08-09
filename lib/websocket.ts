import { isNil } from 'lodash';
import { io, Socket } from 'socket.io-client';
import { isBrowser } from './helper';

export const wsConnect = (): Socket|null|undefined => {
    console.log('wsConnect');
    if (isBrowser()) {
        const token = localStorage.getItem('bearerToken');
        if (isNil(token)) {
            return null;
        }
        try {
            const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_HOST as string, {
                autoConnect: true,
                extraHeaders: {
                    Authorization: `Bearer ${token}`
                },
                transports: ['webscoket'],
                secure: true,
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