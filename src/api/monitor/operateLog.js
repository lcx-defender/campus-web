import request from '@/utils/request.js';

// 查询操作日志列表
export const getOperLogPage = (data) => {
  return request.post('/operate-log/pageList', data);
};

// 删除操作日志
export const deleteOperLog = (logIds) => {
  return request.delete('/operate-log/remove/'+ logIds);
};

// 清空操作日志
export const cleanOperLog = () => {
  return request.delete('/operate-log/removeAll');
};