import Cookies from 'js-cookie';
const TokenKey = 'User-Token';

export function getToken() {
    console.log('Token get:', Cookies.get(TokenKey));
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    console.warn('Token set:', token);
    return new Promise((resolve) => {
        Cookies.set(TokenKey, token, { expires: 7 });
        resolve(); // 确保设置完成后再继续
    });
}

export function removeToken() {
    console.log('Token remove:', Cookies.get(TokenKey));
    return Cookies.remove(TokenKey)
}