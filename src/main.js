import './assets/main.scss';

import { createApp } from 'vue';
import App from './App.vue';
// 引入pina
import pinia from '@/store/index.js';
// 引入element-plus组件库
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入路由
import { router } from '@/router/index.js';
import '@/router/permission.js';
// import Cookies from 'js-cookie';
import locale from 'element-plus/es/locale/lang/zh-cn';
// 引入 SVG 图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'

const app = createApp(App);
app.component('svg-icon', SvgIcon);
// 状态库，用来存放权限、用户个人信息
app.use(pinia);
// 路由
app.use(router);
// 使用element-plus组件
app.use(ElementPlus, {
    locale: locale,
    // 支持 large、default、small
    // size: Cookies.get('size') || 'default'
})
app.mount('#app');
