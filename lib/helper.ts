import { deleteCookie } from "cookies-next";
import { isNil } from "lodash";

export const isBrowser = (): boolean => typeof document !== 'undefined';

export const getItemFromLocalStorage = (item: string): string => {
    return isBrowser() ? (localStorage.getItem(item) || '') : '';
};

export const isLogin = (): boolean => !isNil(getItemFromLocalStorage('bearerToken'));

export const clearClientLoginState = () => {
    if (isBrowser()) {
        localStorage.removeItem('bearerToken');
        localStorage.removeItem('avatar');
        localStorage.removeItem('nickname');
        localStorage.removeItem('userid');
        deleteCookie('token');
        deleteCookie('avatar');
        deleteCookie('userId');
    }
}
