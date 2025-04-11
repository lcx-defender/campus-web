import { createRouter, createWebHistory } from 'vue-router';

// 公共路由
const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/layout.vue'), // 首页组件
    redirect: '/home', // 重定向到/home
    children: [
        {
            path: '/home',
            component: () => import('@/views/home/index.vue'), // 首页组件
        },
        {
            path: '/apply',
            component: () => import('@/views/home/apply.vue'), // 申请组件
        },
        {
            path: '/schools',
            component: () => import('@/views/home/schools.vue'), // 入驻学校组件
        },
        {
          path: '/about',
          component: () => import('@/views/home/about.vue'), // 关于我们组件
        }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'), // 登录组件
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('@/views/service/layout.vue'), // 服务组件
    redirect: '/user/selfInfo',
    meta: {
      title: '个人中心',
      icon: 'el-icon-user'
    },
    children: [
      {
        path: '/user/selfInfo',
        component: () => import('@/views/service/personalCenter.vue'), // 用户信息组件
      }
    ]
  }
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [];

const router = createRouter({
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

export default router;