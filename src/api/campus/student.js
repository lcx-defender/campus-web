import request from '@/utils/request.js';

// 新增学生用户
export const addStudentService = (data) => {
    return request.post('/student/addStudent', data);
}