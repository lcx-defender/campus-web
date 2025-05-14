// getDeptTree, addDept, deleteDept, updateDept, getDeptTreeSelect
import request from '@/utils/request.js'

export const getDeptTreeSelect = () => {
  return request.get('/dept/treeSelect')
}
export const getDeptTree = (data) => {
  return request.post('/dept/selectDeptTreeList', data)
}
export const addDept = (data) => {
  return request.post('/dept/addDept', data)
}

export const deleteDept = (deptId) => {
  return request.delete('/dept/deleteDept/' + deptId)
}

export const updateDept = (data) => {
  return request.put('/dept/updateDept', data)
}

export function updateDeptStatus (deptId, status) {
  return request.put('/dept/updateDeptStatus',
    {params: { deptId, status}})
}