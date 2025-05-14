import request from '@/utils/request';

// 查询在线用户列表
export const getUserOnlinePage = (data) => {
    return request.post('/user-online/getPageList', data);
}

// 强制退出
export const forceLogout = (tokenId) => {
    return request.delete(`/user-online/forceLogout/${tokenId}`);
}