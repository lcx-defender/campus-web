import { createRouter, createWebHistory } from 'vue-router';

// 引入首页组件
import homeLayout from '@/views/home/layout.vue';

// 公共路由
const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: homeLayout, // 首页组件
    redirect: '/home', // 重定向到/home
    children: [
        {
            path: '/home',
            component: () => import('@/components/home/index.vue'), // 首页组件
        },
        {
            path: '/apply',
            component: () => import('@/components/home/apply.vue'), // 申请组件
        },
        {
            path: '/schools',
            component: () => import('@/components/home/schools.vue'), // 入驻学校组件
        },
        {
            path: 'apply',
            component: () => import('@/components/home/apply.vue'), // 申请使用组件
        },
        {
          path: '/about',
          component: () => import('@/components/home/about.vue'), // 关于我们组件
        }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'), // 登录组件
  },
  {
    path: '/service',
    component: () => import('@/views/service/layout.vue'), // 服务组件
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes, // 修正为 routes
});

export default router;