import { isNil } from "lodash";

export const isBrowser = (): boolean => typeof document !== 'undefined';

export const getItemFromLocalStorage = (item: string) => isBrowser() && localStorage.getItem(item);

export const isLogin = (): boolean => !isNil(getItemFromLocalStorage('bearerToken'));

