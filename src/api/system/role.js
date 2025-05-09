import request from '@/utils/request.js';

export const getAllRoles = () => {
    return request.get('/role/getAllRole');
}