import request from '@/utils/request.js';

// 上传普通图片
export const uploadImage = (data) => {
    return request.post('/upload/image', data);
}

// 上传用户头像
export const uploadAvatar = (data) => {
    return request({
        url: '/upload/avatar',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        // 添加以下配置以确保正确发送 FormData
        transformRequest: [function (data) {
            return data; // 不转换 FormData
        }]
    });
}