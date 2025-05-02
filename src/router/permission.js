// 构造动态路由
import {router} from '@/router/index.js'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { logout } from '@/api/login.js';
import {useUserStore} from '@/store/user.js'
import {usePermissionStore} from '@/store/permission.js'
import pinia from '@/store';


NProgress.configure({ showSpinner: false });
const whiteList = ['/login','/', '/home','/apply','/schools','/about']; // no redirect whitelist

router.beforeEach((to, from, next) => {
  console.log('路由跳转', to.path, from.path)
  NProgress.start()
  const userStore = useUserStore();
  
  if (userStore.token) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/service' })
      NProgress.done()
    } else if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 如果有 token 但没有用户信息，则获取用户信息
      if (!userStore.userInfo) {
        userStore.fetchUserInfo()
          .then(() => {
            const permissionStore = usePermissionStore();
            return permissionStore.generateRoutes();
          })
          .then((rewriteRoutes) => {
            // 根据后端返回的路由动态挂载到 /service 的 children 下
            const serviceRoute = router
              .getRoutes()
              .find((route) => route.path === '/service');
            if (serviceRoute) {
              rewriteRoutes.forEach((route) => {
                router.addRoute('service',route); // 动态添加到 /service 的子路由
              });
            }
            next({ ...to, replace: true }); // hack方法 确保路由更新后再跳转
          })
          .catch((err) => {
            logout()
              .then(() => {
                ElMessage.error(err);
                next({ path: '/' });
              });
          });
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
