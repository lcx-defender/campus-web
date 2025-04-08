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
        // 异步操作的状态改为失败
        return Promise.reject(result.data);
    }, 
    err => {
        if (err.code === 'ECONNABORTED') {
            ElMessage.error('请求超时，请稍后重试');
        } else if (err.response) {
            if (err.response.status === 401) {
                ElMessage.error('请先登录');
                router.push('/login');
            } else {
                ElMessage.error(err.response.data?.msg || '服务异常');
            }
        } else {
            ElMessage.error('网络错误，请检查您的网络连接');
        }
        return Promise.reject(err);
    }
);

export default service;