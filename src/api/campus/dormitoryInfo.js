import request from '@/utils/request'

// 分页查询宿舍信息
export const getDormitoryInfoPage = (data) => {
    return request.post('/dormitory-info/getDormitoryInfoPage', data);
}
// 新增宿舍信息
export const addDormitoryInfo = (data) => {
    return request.post('/dormitory-info/addDormitoryInfo', data);
}
// excel导入宿舍信息
export const addBatchDormitoryInfo = (data) => {
    return request.post('/dormitory-info/addDormitoryInfoBatch', data);
}
// 删除宿舍信息
export const deleteDormitoryInfo = (ids) => {
    return request.delete('/dormitory-info/deleteDormitoryInfo/' + ids);
}
// 编辑宿舍信息
export const editDormitoryInfo = (data) => {
    return request.put('/dormitory-info/editDormitoryInfo', data);
}
// 导出宿舍信息
export const exportDormitoryInfo = (data) => {
    return request({
        url: '/dormitory-info/exportDormitoryInfo',
        method: 'post',
        data,
        responseType: 'blob',
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });
}
// 查询用户自己信息
export const getSelfDormitoryInfo = () => {
    return request.get('/dormitory-info/getSelfDormitoryInfo');
}