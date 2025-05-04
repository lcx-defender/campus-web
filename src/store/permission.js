import { getRouters } from '@/api/menu.js'
import { defineStore } from 'pinia'
import { router, constantRoutes, dynamicRoutes } from '@/router/index.js'
const Layout = () => import('@/components/layout/index.vue')
const ParentView = () => import('@/components/ParentView/index.vue')
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('@/views/**/*.vue')

export const usePermissionStore = defineStore('permission',
  {
    state: () => ({
      routes: [],
      sidebarRouters: [],
      hasRoutes: false,
    }),
    actions: {
      setRoutes(routes) {
        this.routes = routes;
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes;
      },
      async generateRoutes() {
        const res = await getRouters();
        // 向后端请求路由数据
        console.log('后端获取的路由数据', res.data)
        const sdata = JSON.parse(JSON.stringify(res.data))
        const rdata = JSON.parse(JSON.stringify(res.data))
        // 将多层级的子路由扁平化，用于动态添加到 Vue Router,path拼接完整
        const sidebarRoutes = filterAsyncRouter(sdata, false, true)
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        console.log('rewriteRoutes', rewriteRoutes)
        console.log('加载动态路由前的完整路由', router.getRoutes())
        const serviceRoute = router.getRoutes().find(route => route.path === '/service');

        if (serviceRoute) {
          // 先移除原有的service路由
          router.removeRoute('service');
          // 重新添加service路由，包含新的子路由
          router.addRoute({
            ...serviceRoute,
            children: [...serviceRoute.children, ...sidebarRoutes]
          });
        }

        // serviceRoute.children = [...serviceRoute.children, ...sidebarRoutes]
        // 侧边栏是以service为父路由的
        this.setSidebarRouters(serviceRoute);
        this.setRoutes(router.getRoutes());
        this.hasRoutes = true;
        console.log('store处理完时的完整路由', router.getRoutes());
        return this.routes
      }
    },
    // persist: {
    //   key: 'permission-store',
    //   storage: localStorage,
    //   paths: ['routes', 'sidebarRouters', 'hasRoutes'] // 添加hasRoutes到持久化
    // }
  });

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, parentPath = '', type = false) {
  return asyncRouterMap.map(route => {
    // 拼接 path
    if (parentPath && !route.path.startsWith('/')) {
      route.path = `${parentPath}/${route.path}`.replace(/\/+/g, '/')
    }
    if (type && route.children) {
      route.children = filterChildren(route.children, route.path)
    }
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
        route.isLayout = true
      } else if (route.component === 'ParentView') {
        route.component = ParentView
        route.isParentView = true
      } else {
        const view = loadView(route.component)
        if (view) {
          route.component = view
        } else {
          // 没有找到对应的组件，保留原始 component 字段，便于排查
          // 或者你可以加个警告
          console.warn('未找到组件：', route.component)
        }
      }

    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route.path, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return route
  })
}

function filterChildren(childrenMap, parentPath = '') {
  return childrenMap.map(child => {
    if (parentPath && !child.path.startsWith('/')) {
      child.path = `${parentPath}/${child.path}`.replace(/\/+/g, '/')
    }
    if (child.children && child.children.length) {
      child.children = filterChildren(child.children, child.path)
    }
    return child
  })
}

export const loadView = (view) => {
  let res;
  // console.log('全部模块', modules)
  // console.log('当前模块', view)
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = modules[path];
      // console.log('当前模块路径', path);
      // console.log('当前模块component:', res);
      break;
    }
  }
  return res
}


