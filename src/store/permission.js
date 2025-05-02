import { getRouters } from '@/api/menu.js'
import { defineStore } from 'pinia'
import { router, constantRoutes, dynamicRoutes } from '@/router/index.js'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('@/views/**/*.vue')

export const usePermissionStore = defineStore('permission',
  {
    state: () => ({
      routes: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        this.routes = constantRoutes.concat(routes)
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      generateRoutes() {
        return new Promise(resolve => {
          // 向后端请求路由数据
          getRouters().then(res => {
            console.log('后端获取的路由数据', res.data)
            const sdata = JSON.parse(JSON.stringify(res.data))
            const rdata = JSON.parse(JSON.stringify(res.data))

            // path拼接不完整(此处我不想在渲染菜单栏时拼接，权且不使用)
            const sidebarRoutes = filterAsyncRouter(sdata)

            // 将多层级的子路由扁平化，用于动态添加到 Vue Router,path拼接完整
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
             
          
            const serviceRoute = router.getRoutes().find(route => route.path === '/service');
            if (serviceRoute) {
              rewriteRoutes.forEach(route => {
                router.addRoute('service', route); // 动态添加到 /service 的子路由
              });
            }
            // 侧边栏是以service为父路由的
            this.setSidebarRouters(serviceRoute);
            
            this.setRoutes(rewriteRoutes);
            resolve(rewriteRoutes);
          })
        })
      }
    },
    persist: {
      key: 'permission-store',
      storage: localStorage,
      paths: ['routes', 'sidebarRouters']
    }
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter (asyncRouterMap, lastRouter = false , type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      route.component = loadView(route.component)
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren (childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el))
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes (routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}


