import request from '@/utils/request.js';

// 获取教师用户列表
export const getTeacherPage = (data) => {
    return request.post('/teacher/pageList', data);
}

export const getTeacherUserPage = (data) => {
    return request.post('/teacher/pageTeacherUser', data);
}

// 新增教师用户
export const addTeacherService = (data) => {
    return request.post('/teacher/addTeacher', data);
}

// 编辑教师用户
export const editTeacherService = (data) => {
    return request.put('/teacher/editTeacher', data);
}