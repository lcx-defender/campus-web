import request from '@/utils/request.js';

// 获取所有角色
export const getAllRoles = () => {
    return request.get('/role/getAllRole');
}

// 查询当前用户角色
export const getCurrentRole = () => {
    return request.get('/role/getCurrentRole');
}

// 获取角色分页列表
export const getRolePageList = (data) => {
    return request.post('/role/getPageList', data);
}

// 新增角色
export const addRole = (data) => {
    return request.post('/role/addRole', data);
}

// 删除角色
export const deleteRole = (roleId) => {
    return request.delete('/role/deleteRole/' + roleId);
}

// 修改角色
export const updateRole = (data) => {
    return request.put('/role/updateRole', data);
}

// 获取角色详细
export const getRole = (roleId) => {
    return request.get('/role/getRole/' + roleId);
}

// 查询角色对应的权限菜单
export const getMenusByRoleId = (roleId) => {
    return request.get('/role/getMenusByRoleId/' + roleId);
}

// 查询角色授予的用户
export const getUsersByRoleId = (roleId) => {
    return request.get('/role/getUsers/' + roleId);
}

// 给角色分配权限菜单
export const grantRoleMenus = (data) => {
    return request.put('/role/grantRoleMenus', data);
}

// 解绑角色对应的所有用户
export const unbindRoleUsers = (roleId) => {
    return request.delete('/role/unbindRoleUsers/' + roleId);
}