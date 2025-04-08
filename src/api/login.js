// 导入request.js请求工具
import request from '@/utils/request.js';

// 登录方法
export const loginByUsername = (loginform) => {
  return request.post('/loginByUsername', loginform);
}

// 获取验证码
export const getCodeImg = () => {
  return request.get('/captchaImage');
}

export const userInfoService = () => {
  return request.get('/user/getSelfInfo');
}
