//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
import {router} from '@/router/index.js';
import { useUserStore } from '@/store/user.js';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// vite.config.js中配置代理
const service = axios.create(
    {
        baseURL: import.meta.env.VITE_APP_BASE_API,
        timeout: 5000,
    }
);
// 请求拦截
service.interceptors.request.use(
    config => {
        const userStore = useUserStore();
        console.log('请求拦截器', userStore.token);
        if(userStore.token) {
            config.headers.Authorization = userStore.getToken();
            console.log('请求头', config.headers.Authorization);
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
        if(result.data.code===401) {
            ElMessage.error('请先登录');
            router.push('/login');
            return Promise.reject('请先登录');
        }
        ElMessage.error(result.data.message?result.data.message:'服务异常')
        return Promise.reject(result.data);
    }, 
    err => {
        console.log('错误信息', err);
        return Promise.reject(err);
    }
);

export default service;