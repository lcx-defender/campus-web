// 导入request.js请求工具
import request from '@/utils/request.js';

// 获取用户详细信息
export const userInfoService = () => {
    return request.get('/user/getSelfInfo');
}