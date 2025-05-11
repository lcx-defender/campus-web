import request from '@/utils/request.js';

// 获取当前用户权限的路由菜单
export const getRouters = () => {
    return request.get('/getRouters');
}

// 获取所有权限菜单treeSelect
export const getMenuTreeSelect = () => {
    return request.get('/menu/treeSelect');
}