import { isNil } from "lodash";

export const isBrowser = (): boolean => typeof document !== 'undefined';

export const isLogin = (): boolean => isBrowser() && !isNil(localStorage.getItem('bearerToken'));