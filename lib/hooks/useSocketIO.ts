import { useLatest, useMemoizedFn, useUnmount } from 'ahooks';
import { isNil } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface Options {
  reconnectLimit?: number;
  reconnectInterval?: number;
  manual?: boolean;
  onOpen?: (instance: Socket) => void;
  onClose?: (instance: Socket) => void;
  onError?: (instance: Socket) => void;
  protocols?: string | string[];
}

export interface Result {
  latestMessage?: WebSocketEventMap['message'];
  sendMessage: Socket['emit'];
  disconnect: () => void;
  connect: () => void;
  readyState: ReadyState;
  webSocketIns?: Socket;
}

export default function useSocketIO(socketUrl: string, options: Options = {}): Result {
  const {
    reconnectLimit = 3,
    reconnectInterval = 5 * 1000,
    manual = false,
    onOpen,
    onClose,
    onError,
  } = options;

  const onOpenRef = useLatest(onOpen);
  const onCloseRef = useLatest(onClose);
  const onErrorRef = useLatest(onError);

  const reconnectTimesRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const websocketRef = useRef<Socket>();

  const [latestMessage, setLatestMessage] = useState<WebSocketEventMap['message']>();
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.Closed);

  const [token, setToken] = useState('');
  const reconnect = () => {
    if (
      reconnectTimesRef.current < reconnectLimit
    ) {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      reconnectTimerRef.current = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        connectWs();
        reconnectTimesRef.current++;
      }, reconnectInterval);
    }
  };

  const connectWs = () => {
    console.log(`connectWs with token - ${token}`);
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const ws = io(socketUrl, {
        autoConnect: true,
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        }
    });
    setReadyState(ReadyState.Connecting);

    ws.on('connect', () => {
        if (websocketRef.current !== ws) {
          return;
        }
        onOpenRef.current?.(ws);
        reconnectTimesRef.current = 0;
        setReadyState(ReadyState.Open);
    })

    ws.on('disconnect', () => {
        if (websocketRef.current !== ws) {
          return;
        }
        onCloseRef.current?.(ws);
        // closed by server
        if (websocketRef.current === ws) {
        //   reconnect();
        }
        // closed by disconnect or closed by server
        if (!websocketRef.current || websocketRef.current === ws) {
          setReadyState(ReadyState.Closed);
        }
    })

    ws.on('connect_error', () => {
        if (websocketRef.current !== ws) {
          return;
        }
        // reconnect();
        onErrorRef.current?.(ws);
        setReadyState(ReadyState.Closed);
    })

    websocketRef.current = ws;
  };

  const sendMessage: Socket['emit'] = (event: string, message: any) => {
    if (isNil(websocketRef.current) || readyState !== ReadyState.Open) {
        throw new Error('WebSocket disconnected');
    }
    return websocketRef.current.emit(event, message);
  };

  const connect = () => {
    reconnectTimesRef.current = 0;
    connectWs();
  };

  const disconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    reconnectTimesRef.current = reconnectLimit;
    websocketRef.current?.close();
    websocketRef.current = undefined;
  };

  useEffect(() => {
    setToken(localStorage.getItem('bearerToken') as string);
    console.log(`set ws token ${localStorage.getItem('bearerToken')}`);
    if (!manual && socketUrl) {
      connect();
    }
  }, [socketUrl, manual]);

  useUnmount(() => {
    disconnect();
  });

  return {
    latestMessage,
    sendMessage: useMemoizedFn(sendMessage),
    connect: useMemoizedFn(connect),
    disconnect: useMemoizedFn(disconnect),
    readyState,
    webSocketIns: websocketRef.current,
  };
}