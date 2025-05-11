<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Delete, Refresh, Edit, Lock, User } from '@element-plus/icons-vue';
import { getRolePageList, deleteRole, addRole, updateRole, getMenusByRoleId, grantRoleMenus, unbindRoleUsers } from '@/api/system/role.js';
import {getMenuTreeSelect} from '@/api/system/menu.js';
const loading = ref(false);
const searchForm = ref({
  roleName: null,
  roleKey: null,
  roleStatus: null,
  pageNo: 1,
  pageSize: 10,
});
const tableData = ref([]); // 查询获得分页数据
const total = ref(0); // 查询数据总数
const selectedRows = ref([]); // 选中行
const ids = ref([]); // 选中行的id
const single = ref(true); // 是否单选
const dialogVisible = ref(false); // 新增/编辑对话框
const dialogType = ref('');
const roleForm = ref({
  roleId: '',
  roleName: '',
  roleKey: '',
  roleStatus: 1,
});
const roleMenusVo = ref({
  roleId: '',
  menuIds: []
});
const authDialogVisible = ref(false); // 分配权限对话框
const authTreeSelect = ref([]);
const getRolePage = async () => {
  loading.value = true;
  const res = await getRolePageList(searchForm.value);
  tableData.value = res.data.list;
  total.value = res.data.total;
  loading.value = false;
};
const reset = () => {
  roleForm.value.roleId = '';
  roleForm.value.roleName = '';
  roleForm.value.roleKey = '';
  roleForm.value.roleStatus = 1;
};
const handleSearch = () => {
  searchForm.value.pageNo = 1;
  getRolePage();
};
const resetSearch = () => {
  searchForm.value.roleName = null;
  searchForm.value.roleKey = null;
  searchForm.value.roleStatus = null;
  searchForm.value.pageNo = 1;
  getRolePage();
}; // 重置搜索条件
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
  ids.value = rows.map((row) => row.roleId);
  single.value = rows.length <= 1;
}; // 表格多选
const handleAdd = () => {
  dialogType.value = '新增角色';
  reset();
  dialogVisible.value = true;
}; // 新增按钮
const handleEdit = (row: any) => {
  dialogType.value = '编辑角色';
  roleForm.value.roleId = row.roleId;
  roleForm.value.roleName = row.roleName;
  roleForm.value.roleKey = row.roleKey;
  roleForm.value.roleStatus = row.roleStatus;
  dialogVisible.value = true;
}; // 编辑按钮
const handleDelete = (row: any) => {
  const _roleIds = row?.roleId || ids.value;
  ElMessageBox.confirm('确认删除该角色吗？', '提示', {
    type: 'warning'
  }).then(async() => {
    await deleteRole(_roleIds);
    ElMessage.success('删除成功');
    getRolePage();
  });
}; // 删除按钮
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的角色');
    return;
  }
  const _roleIds = ids.value;
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 个角色吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteRole(_roleIds);
    getRolePage();
    ElMessage.success('批量删除成功');
  });
};// 批量删除
// 提交表单
const handleSubmit = async() => {
  if (dialogType.value === '新增角色') {
    await addRole(roleForm.value);
    getRolePage();
    ElMessage.success('新增成功');
  } else {
    await updateRole(roleForm.value);
    getRolePage();
    ElMessage.success('编辑成功');
  }
  dialogVisible.value = false;
};
// 分配权限
const handleAssignAuth = async (row: any) => {
  roleMenusVo.value.roleId = row.roleId;
  const res = await getMenusByRoleId(row.roleId);
  roleMenusVo.value.menuIds = res.data.map((menu) => menu.menuId);
  const response = await getMenuTreeSelect();
  authTreeSelect.value = response.data;
  authDialogVisible.value = true;
};
// 提交权限
const handleAuthSubmit = async () => {
  await grantRoleMenus(roleMenusVo.value);
  ElMessage.success('权限分配成功');
  authDialogVisible.value = false;
};
// 解绑用户
const handleUnbindUser = (row: any) => {
  ElMessageBox.confirm('确认解绑该角色下的所有用户吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    unbindRoleUsers(row.roleId);
    ElMessage.success('解绑成功');
  });
};
const handleSizeChange = (val: number) => {
  searchForm.value.pageSize = val;
  getRolePage();
};
const handleCurrentChange = (val: number) => {
  searchForm.value.pageNo = val;
};
getRolePage();
</script>
<template>
  <div class="container">
    <div class="content">
      <div class="search-area">
        <div class="search-form">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable />
          <el-input v-model="searchForm.roleKey" placeholder="请输入权限字符" clearable />
          <el-select v-model="searchForm.roleStatus" placeholder="角色状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon>
              <Refresh />
            </el-icon>重置
          </el-button>
        </div>
      </div>
      <!-- 操作按钮区域 -->
      <div class="operation-buttons">
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>新增
        </el-button>
        <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
          <el-icon>
            <Delete />
          </el-icon>删除
        </el-button>
      </div>
      <!-- 表格区域 -->
      <el-table :data="tableData" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="roleName" label="角色名称" width="200" />
        <el-table-column prop="roleKey" label="权限字符" width="200" />
        <el-table-column prop="roleStatus" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.roleStatus === '1' ? 'success' : 'danger'">
              {{ row.roleStatus === '1' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <div class="operation-cell">
              <el-tooltip content="修改" placement="top">
                <el-button type="primary" link @click="handleEdit(row)">
                  <el-icon>
                    <Edit />
                  </el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button type="primary" link @click="handleDelete(row)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="分配权限" placement="top">
                <el-button type="primary" link @click="handleAssignAuth(row)">
                  <el-icon>
                    <Lock />
                  </el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="解绑用户" placement="top">
                <el-button type="primary" link @click="handleUnbindUser(row)">
                  <el-icon>
                    <User />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="searchForm.pageNo" v-model:page-size="searchForm.pageSize" :total="total"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :pager-count="7"
          prev-text="上一页" next-text="下一页" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogType" v-model="dialogVisible" width="500px">
      <el-form :model="roleForm" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="roleForm.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="roleForm.roleStatus">
            <el-radio :label="'1'">正常</el-radio>
            <el-radio :label="'0'">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="!rounded-button" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" class="!rounded-button" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" v-model="authDialogVisible" width="400px">
      <el-tree-select v-model="roleMenusVo.menuIds" :data="authTreeSelect" multiple show-checkbox node-key="id"
        :props="{ label: 'label', children: 'children', value: 'value' }" placeholder="请选择权限" class="w-full" collapse-tags collapse-tags-tooltip  />
      <template #footer>
        <el-button class="!rounded-button" @click="authDialogVisible = false">取消</el-button>
        <el-button type="primary" class="!rounded-button" @click="handleAuthSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

.content {
  background-color: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
  padding: 20px;
}

.search-area {
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.search-form .el-input {
  width: 240px;
}

.search-form .el-select {
  width: 240px;
}

.search-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operation-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.operation-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.el-input-number .el-input__inner {
  text-align: left;
}
</style>