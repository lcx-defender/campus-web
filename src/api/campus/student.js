import request from '@/utils/request.js';

export const getStudentPage = (data) => {
    return request.post('/student/pageStudentUser', data);
}

// 新增学生用户
export const addStudentService = (data) => {
    return request.post('/student/addStudent', data);
}

// 通过excel批量导入学生
export const batchAddStudent = (data) => {
    return request.post('/student/batchAddStudent', data);
}

// 批量导出学生信息
export const batchExportStudent = (data) => {
    return request({
        url: '/student/exportStudent',
        method: 'post',
        data,
        responseType: 'blob',
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });
}

// 编辑学生用户
export const editStudentService = (data) => {
    return request.put('/student/editStudent', data);
}