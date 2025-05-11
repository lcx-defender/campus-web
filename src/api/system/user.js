// 导入request.js请求工具
import request from '@/utils/request.js';

// 获取自己详细信息
export const userInfoService = () => {
    return request.get('/user/getSelfInfo');
}
// 获取用户详细信息
export const getUser = (userId) => {
    return request.get('/user/getUser/' + userId);
}
// 获取用户列表
export const listUser = (data) => {
    return request.post('/user/pageList', data);
}

// 获取用户的所有角色
export const getUserRoles = (userId) => {
    return request.get('/user/getUserRole/' + userId);
}

// 修改自己密码
export const updatePasswordService = (data) => {
    return request.put('/user/updatePassword', data);
}

// 管理员修改用户密码
export const resetUserPasswordService = (data) => {
    return request.put('/user/resetPassword', data);
}

// 修改用户自己信息
export const updateUserInfoService = (data) => {
    return request.put('/user/updateSelfInfo', data);
}

// 管理员修改其他用户信息
export const updateUser = (data) => {
    return request.put('/user/updateUser', data);
}

// 更新用户权限信息
export const updateUserRoles = (data) => {
    return request.put('/user/updateUserRoles', data);
}

// 新增系统用户
export const addUser = (data) => {
    return request.post('/user/addUser', data);
}

// 逻辑删除用户
export const delUser = (userIds) => {
    return request.delete('/user/deleteUsers'+'/'+userIds);
}

// 封禁用户
export const banUser = (userIds) => {
    return request.put('/user/banUser' + '/' + userIds);
}

// 恢复用户
export const recoverUser = (userIds) => {
    return request.put('/user/recoverUser' + '/' + userIds);
}