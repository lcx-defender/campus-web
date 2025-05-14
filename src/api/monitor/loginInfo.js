import request from '@/utils/request';

export const getLogInfoPage = (data) => {
    return request.post('/login-info/pageList',data);
}

export const deleteLoginInfo = (infoIds) => {
    return request.post('/login-info/delete/', infoIds);
}

export const clearLoginInfo = () => {
    return request.post('/login-info/clear');
}