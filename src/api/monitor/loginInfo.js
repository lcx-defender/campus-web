import request from '@/utils/request';

export const getLogInfoPage = (data) => {
    return request.post('/login-info/pageList',data);
}

export const deleteLoginInfo = (infoIds) => {
    return request.delete('/login-info/delete/', infoIds);
}

export const clearLoginInfo = () => {
    return request.delete('/login-info/clear');
}