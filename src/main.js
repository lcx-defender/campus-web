import './assets/main.scss';

import { createApp } from 'vue';
import App from './App.vue';
// 引入element-plus组件库
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入路由
import router from '@/router/index.js';
// 引入pina
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import locale from 'element-plus/dist/locale/zh-cn.js';

const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist);

// 状态库，用来存放token、权限、用户个人信息
app.use(pinia);
app.use(router);
// 使用element-plus组件
app.use(ElementPlus,{locale});
app.mount('#app');
