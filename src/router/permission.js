// 构造动态路由
import { router } from '@/router/index.js'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { logout } from '@/api/login.js';
import { useUserStore } from '@/store/user.js'
import { usePermissionStore } from '@/store/permission.js'

NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/', '/home', '/apply', '/schools', '/about']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  console.log('路由跳转', to.path, from.path)
  NProgress.start()
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  if (userStore.token) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/service' })
      NProgress.done()
    } else if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      try {
        // 如果没有路由信息，加载路由
        if (!permissionStore.hasRoutes) {
          await permissionStore.generateRoutes();
        }
        next();
      } catch (err) {
        console.error('路由加载失败:', err);
        logout();
        ElMessage.error('路由加载失败，请重新登录');
        userStore.setToken('');
        next({ path: '/login' });
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
