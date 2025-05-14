import dayjs from 'dayjs';

/**
 * 格式化日期
 * @param {number|string|Date} timestamp - 时间戳/日期字符串/Date对象
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 格式化模式
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  return timestamp ? dayjs(timestamp).format(format) : '-'
}