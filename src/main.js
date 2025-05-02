import './assets/main.scss';

import { createApp } from 'vue';
import App from './App.vue';
// 引入pina
import pinia from '@/store/index.js';
// 引入element-plus组件库
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入路由
import {router} from '@/router/index.js';
import '@/router/permission.js';

const app = createApp(App);

// 状态库，用来存放token、权限、用户个人信息
app.use(pinia);
// 路由
app.use(router);
// 使用element-plus组件
app.use(ElementPlus);
app.mount('#app');
