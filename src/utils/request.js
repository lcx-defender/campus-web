//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user.js';
import router from '@/router/index.js';

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
        if(userStore.getToken()) {
            config.headers.Authorization = userStore.getToken();
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
            return result.data;
        }
        ElMessage.error(result.data.message?result.data.message:'服务异常')
        if(result.data.code===401) {
            router.push('/login');
        }
        // 异步操作的状态改为失败
        return Promise.reject(result.data);
    }, 
    err => {
        console.log('错误信息', err);
        return Promise.reject(err);
    }
);

export default service;