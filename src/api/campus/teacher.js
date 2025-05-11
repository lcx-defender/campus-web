import request from '@/utils/request.js';

// 新增教师用户
export const addTeacherService = (data) => {
    return request.post('/teacher/addTeacher', data);
}