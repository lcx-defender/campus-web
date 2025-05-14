//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
import {router} from '@/router/index.js';
import { useUserStore } from '@/store/user.js';
import { getToken } from '@/utils/token.js';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// vite.config.js中配置代理
const service = axios.create(
    {
        baseURL: import.meta.env.VITE_APP_BASE_API,
        timeout: 10000,
    }
);
// 请求拦截
service.interceptors.request.use(
    config => {
        const token = getToken();
        if(token) {
            config.headers.Authorization = token;
            // console.log('请求头', getToken());
        }
        return config;
    }, error => {
        console.log(error);
        return Promise.reject(error);
    }
);

// 响应拦截
service.interceptors.response.use(
    result => {
        if(result.data.code===200) {
            return result.data; // 保持原始响应结构
        }
        else if(result.data.code===401) {
            ElMessage.error(result.data.message?result.data.message:'请重新登录')
            router.push('/login');
            return Promise.reject('请重新登录');
        }
        ElMessage.error(result.data.message?result.data.message:'服务异常')
        return Promise.reject(result.data);
    }, 
    err => {
        if(err.code === 'ECONNABORTED') {
            ElMessage.error('请求超时，请稍后再试')
        } else {
            ElMessage.error(err.message?err.message:'服务异常')
        }
        console.error('错误信息', err);
        return Promise.reject(err);
    }
);

export default service;