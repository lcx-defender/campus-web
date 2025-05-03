import { createRouter, createWebHistory } from 'vue-router';

// 公共路由
export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/home/layout.vue'), // 首页组件
    redirect: '/index', // 重定向到/home
    children: [
        {
            path: '/index',
            meta: {title: '首页'},
            component: () => import('@/views/home/index.vue'), // 首页组件
        },
        {
            path: '/apply',
            meta: {title: '申请使用'},
            component: () => import('@/views/home/apply.vue'), // 申请组件
        },
        {
            path: '/schools',
            meta: {title: '入驻学校'},
            component: () => import('@/views/home/schools.vue'), // 入驻学校组件
        }
    ]
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/service',
    name: 'service',
    component: () => import('@/views/service/layout.vue'), // 服务组件
    redirect: '/user/selfInfo',
    children: [
      {
        path: '/user/selfInfo',
        meta: {
          title: '个人中心',
          icon: 'el-icon-user'
        },
        component: () => import('@/views/service/personalCenter.vue'), // 用户信息组件
      }
    ]
  }
];

// 提前写的动态路由，交给 @/store/permission.js 处理
export const dynamicRoutes = [];

export const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes, // 修正为 routes
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});