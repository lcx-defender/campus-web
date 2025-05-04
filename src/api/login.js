// 导入request.js请求工具
import request from '@/utils/request.js';
import { removeToken } from '@/utils/token.js';
// 登录方法
export const loginByUsername = (loginform) => {
  return request.post('/loginByUsername', loginform);
}

// 获取验证码
export const getCodeImg = () => {
  return request.get('/captchaImage');
}

// 退出登录请求
export const logout = async () => {
  try {
    const response = await request.post('/user/logout');
    removeToken(); // 确保后端退出成功后再清除token
    return response;
  } catch (error) {
    console.error('退出登录失败:', error);
    throw error; // 抛出错误以便调用方处理
  }
};
