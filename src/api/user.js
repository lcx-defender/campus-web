// 导入request.js请求工具
import request from '@/utils/request.js';

// 获取用户详细信息
export const userInfoService = () => {
    return request.get('/user/getSelfInfo');
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
export const updateUserInfoByAdminService = (data) => {
    return request.put('/user/updateUser', data);
}


// 新增教师用户
export const addTeacherService = (data) => {
    return request.post('/user/addTeacher', data);
}

// 新增学生用户
export const addStudentService = (data) => {
    return request.post('/user/addStudent', data);
}

// 新增系统用户
export const addUserService = (data) => {
    return request.post('/user/addUser', data);
}