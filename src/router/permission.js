// 构造动态路由
import { router } from '@/router/index.js'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { logout } from '@/api/system/login.js';
import { useUserStore } from '@/store/user.js'
import { usePermissionStore } from '@/store/permission.js'
import { getToken } from '@/utils/token.js'
import { userInfoService } from '@/api/system/user.js'

NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/', '/index', '/apply', '/schools', '/about']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  console.log('路由跳转', from.path, '-->', to.path)
  NProgress.start()
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  if (getToken()) {
    /* 带有token */
    if (to.path === '/login') {
      console.log('携带token访问登录页,跳转')
      next({ path: '/service' })
      NProgress.done()
    } else if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      console.log('免登录白名单，直接进入', to.path)
      next()
    } else {
      console.log('携带token访问其他路由',from.path, '-->', to.path)
      // 访问需要token的路由
      // 如果用户信息不存在，说明是第一次访问，获取用户信息和路由信息
      console.warn('用户信息是否存在:', (userStore.userInfo), ' 路由信息是否存在:', permissionStore.hasRoutes)
      if(!userStore.userInfo && !permissionStore.hasRoutes) {
        // 生成路由,用户信息交给layout组件处理
        try {
          const sidebarRouters = await permissionStore.generateRoutes();
          const userInfo = await userInfoService();
          const userStore = useUserStore();
          userStore.setUserInfo(userInfo.data);
          console.log('路由守卫router',router.getRoutes(), '用户信息', userInfo.data)
          // console.log('路由守卫sidebarRouters', sidebarRouters)
          next({ ...to, replace: true }); // 重新导航到目标路径
        } catch (err) {
          console.error('路由加载失败:', err);
          logout();
          ElMessage.error('路由加载失败，请重新登录');
          next({ path: '/login' });
          NProgress.done();
          return; // 确保退出逻辑
        }
      } else {
        next();
      }
      
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      console.log('免登录白名单，直接进入', to.path)
      next()
    } else {
      console.log('没有token，跳转登录页', to.path)
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
