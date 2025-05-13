import request from '@/utils/request.js'

// 获取当前用户权限的路由菜单
export const getRouters = () => {
  return request.get('/getRouters')
}

// 获取所有权限菜单treeSelect
export const getMenuTreeSelect = () => {
  return request.get('/menu/treeSelect')
}

// 获取所有权限菜单树型结构
export const getMenuTree = (data) => {
  return request.post('/menu/getMenuTree', data || {})
}

export const addMenu = (data) => {
  return request.post('/menu/addMenu', data)
}

export const deleteMenu = (menuId) => {
  return request.delete('/menu/delete/' + menuId)
}

export const updateMenu = (data) => {
  return request.put('/menu/editMenu', data)
}

export const queryMenu = (menuId) => {
  return request.get('/menu/queryMenu/' + menuId)
}
