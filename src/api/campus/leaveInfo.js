import request from '@/utils/request'
// 分页获取请假信息列表
export const getLeaveInfoPage = (data) => {
    return request.post('/leaveInfo/getLeaveInfoPage', data);
}
// 同意请假
export const approveLeaveInfo = (leaveInfoId) => {
    return request.put('/leaveInfo/approveLeaveInfo/' + leaveInfoId);
}
// 拒绝请假
export const rejectLeaveInfo = (leaveInfoId) => {
    return request.put('/leaveInfo/rejectLeaveInfo/' + leaveInfoId);
}