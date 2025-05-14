<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Plus, Edit, Lock, Close, Key, Search, Refresh, Unlock, Upload, Download, Setting } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAllRoles } from "@/api/system/role";
import { listUser, getUser, delUser, addUser, updateUser, banUser, recoverUser, getUserRoles, updateUserRoles } from "@/api/system/user";
import { fa } from 'element-plus/es/locale';
import { get } from 'lodash';
import { formatDate } from '@/utils/format'

const searchForm = ref({
  nickname: null,
  email: null,
  phone: null,
  userType: null,
  userStatus: null,
  pageNo: 1,
  pageSize: 10
});
const userTypeMap = {
  "0": '系统管理&程序员',
  "1": '教师',
  "2": '学生',
};
const userStatusTagMap = {
  "0": { type: 'success', label: '正常' },
  "1": { type: 'warning', label: '封禁' },
  "2": { type: 'danger', label: '删除' },
};
const sexMap = {
  "0": '男',
  "1": '女',
  "2": '保密',
};
const tableData = ref([]);
const total = ref(0);
const loading = ref(true);
const selectedRows = ref([]); // 批量操作选中的行数据
const ids = ref([]); // 批量操作的用户ID数组
const single = ref(true);
const multiple = ref(false);
const open = ref(false); // 对话框的显示与隐藏
const title = ref(''); // 添加删除对话框标题
const userRef = ref(null);
const form = ref({
  userId: null,
  identity: null,
  nickname: null,
  userType: null,
  email: null,
  phone: null,
  sex: null,
  avatar: null,
  password: null,
  userStatus: null,
  remark: null
});
const isEdit = ref(false);
const rules = {
  identity: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  nickname: [],
  userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
  email: [],
  phone: [],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const assignRoleDialogVisible = ref(false);
const roleOptions = ref([]);
const userRolesVo = ref(
  {
    userId: null,
    roleIds: [],
  }
);
const getList = async () => {
  loading.value = true;
  listUser(searchForm.value).then(response => {
    tableData.value = response.data.list;
    total.value = response.data.total;
    loading.value = false;
  });
}
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val;
  ids.value = val.map(item => item.userId);
  single.value = val.length <= 1;
  multiple.value = !val.length;
};
const reset = () => {
  form.value = {
    userId: null,
    identity: null,
    nickname: null,
    userType: null,
    email: null,
    phone: null,
    sex: null,
    avatar: null,
    password: null,
    userStatus: null,
    remark: null
  };
  userRef.value = null;
};
const handleAdd = () => {
  reset();
  isEdit.value = false; // 新增模式
  rules.password = [{ required: true, message: '请输入密码', trigger: 'blur' }];
  open.value = true;
  title.value = '新增用户';
};

const handleRowEdit = async (row: any) => {
  reset();
  isEdit.value = true;
  rules.password = [];
  rules.userType = [];
  const res = await getUser(row.userId);
  form.value = {
    ...res.data,
    sex: String(res.data.sex),
    userStatus: String(res.data.userStatus),
    userType: String(res.data.userType),
  }
  open.value = true;
  title.value = '修改用户信息';
};

const submitForm = async () => {
  userRef.value.validate(async (valid: any) => {
    if (valid) {
      loading.value = true;
      if (form.value.userId) {
        await updateUser(form.value);
        ElMessage.success('修改成功');
      } else {
        await addUser(form.value);
        ElMessage.success('添加成功');
      }
      open.value = false;
      getList();
    } else {
      ElMessage.error('表单验证失败，请检查输入项');
    }
  });
}
const cancel = () => {
  open.value = false;
  reset();
}
const handleResetPassword = (row: any) => {
  ElMessage.success(`重置密码：${row.nickname}`);
};
const handleBan = (row: any) => {
  const _userIds = row.userId || ids.value;
  const _nicknames = row.nickname || selectedRows.value.map((row) => row.nickname).join(",");
  if (_nicknames.length === 0) {
    ElMessage.warning('请选择要封禁的用户');
    return;
  }
  ElMessageBox.confirm(
    `确定要封禁以下用户吗？\n\r ${_nicknames}`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      loading.value = true;
      await banUser(_userIds);
      getList();
    })
    .catch(() => {
      ElMessage.info("已取消封禁操作");
    }).finally(() => {
      loading.value = false;
    });
};
const handleDelete = (row: any) => {
  const _userIds = row.userId || ids.value;
  const _nicknames = row.nickname || selectedRows.value.map((row) => row.nickname).join(",");
  if (_nicknames.length === 0) {
    ElMessage.warning('请选择要删除的用户');
    return;
  }
  ElMessageBox.confirm(
    `确定要删除以下用户吗？\n\r ${_nicknames}`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      loading.value = true;
      await delUser(_userIds);
      getList();
    })
    .catch(() => {
      ElMessage.info("已取消删除操作");
    }).finally(() => {
      loading.value = false;
    });
};
const handleRecover = async (row: any) => {
  const _userIds = row.userId || ids.value;
  const _nicknames = row.nickname || selectedRows.value.map((row) => row.nickname).join(",");
  if (_nicknames.length === 0) {
    ElMessage.warning('请选择要恢复的用户');
    return;
  }
  ElMessageBox.confirm(
    `确定要恢复以下用户吗？\n\r ${_nicknames}`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      loading.value = true;
      await recoverUser(_userIds);
      getList();
    })
    .catch(() => {
      ElMessage.info("已取消恢复操作");
    }).finally(() => {
      loading.value = false;
    });
};
const handleSizeChange = (val: number) => {
  searchForm.value.pageSize = val;
  console.log('当前页面大小：', val);
  getList();
};
const handleCurrentChange = (val: number) => {
  searchForm.value.pageNo = val;
  console.log('当前页码：', val);
  getList();
};
const handleSearch = () => {
  searchForm.value.pageNo = 1;
  getList();
};
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = '';
  });
  ElMessage.success('重置搜索条件');
  searchForm.value.pageNo = 1;
  getList();
};

const handleAssignRole = async (row: any) => { // 分配角色按钮点击事件
  const userId = row.userId;
  userRolesVo.value.userId = userId;
  userRolesVo.value.roleIds = [];
  const roleLsit = await getAllRoles();
  roleOptions.value = roleLsit.data;
  // 获取当前用户的角色
  const userRoles = await getUserRoles(userId);
  userRolesVo.value.roleIds = userRoles.data.map((role) => role.roleId);
  assignRoleDialogVisible.value = true; // 打开对话框
};

const submitAssignRole = async () => {
  try {
    await updateUserRoles(userRolesVo.value);
    ElMessage.success("角色分配成功");
  } catch (error) {
    ElMessage.error("角色分配失败");
  } finally {
    assignRoleDialogVisible.value = false;
  }
};

getList();
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="search-form">
        <el-input v-model="searchForm.nickname" placeholder="请输入用户昵称" clearable />
        <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
        <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        <el-select v-model="searchForm.userType" placeholder="用户类型">
          <el-option label="系统管理&程序员" :value="0" />
          <el-option label="教师" :value="1" />
          <el-option label="学生" :value="2" />
        </el-select>
        <el-select v-model="searchForm.userStatus" placeholder="用户状态">
          <el-option label="正常" :value="0" />
          <el-option label="封禁" :value="1" />
          <el-option label="删除" :value="2" />
        </el-select>
      </div>
      <div class="button-group">
        <el-button type="primary" class="!rounded-button" @click="handleSearch">
          <el-icon>
            <Search />
          </el-icon>搜索
        </el-button>
        <el-button class="!rounded-button" @click="handleReset">
          <el-icon>
            <Refresh />
          </el-icon>重置
        </el-button>
      </div>
      <div class="button-group">
        <el-button type="primary" class="!rounded-button" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>新增
        </el-button>
        <el-button type="warning" class="!rounded-button" @click="handleBan">
          <el-icon>
            <Lock />
          </el-icon>封禁
        </el-button>
        <el-button type="danger" class="!rounded-button" @click="handleDelete">
          <el-icon>
            <Close />
          </el-icon>注销
        </el-button>
        <el-button type="success" class="!rounded-button" @click="handleRecover">
          <el-icon>
            <Unlock />
          </el-icon>恢复账户
        </el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="nickname" label="用户昵称" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="email" label="邮箱" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="sex" label="性别" width="80" align="center">
          <template #default="scope">
            {{ sexMap[scope.row.sex] }}
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            {{ userTypeMap[scope.row.userType] }}
          </template>
        </el-table-column>
        <el-table-column prop="userStatus" label="用户状态" align="center">
          <template #default="scope">
            <el-tag :type="userStatusTagMap[scope.row.userStatus].type">
              {{ userStatusTagMap[scope.row.userStatus].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button type="primary" link :icon="Edit" @click="handleRowEdit(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="重置密码" placement="top">
              <el-button type="primary" link :icon="Key" @click="handleResetPassword(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="封禁" placement="top">
              <el-button type="warning" link :icon="Lock" @click="handleBan(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="注销" placement="top">
              <el-button type="danger" link :icon="Close" @click="handleDelete(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="恢复账户" placement="top">
              <el-button type="success" link :icon="Refresh" @click="handleRecover(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top">
              <el-button type="primary" link :icon="Setting" @click="handleAssignRole(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <span class="total-count">共 {{ total }} 条</span>
        <el-pagination v-model:current-page="searchForm.pageNo" v-model:page-size="searchForm.pageSize"
          :page-sizes="[10, 20, 30, 50]" :total="total" layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="身份证号" prop="identity">
          <el-input v-model="form.identity" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType" v-if="isEdit">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option v-for="(label, value) in userTypeMap" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option v-for="(label, value) in sexMap" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="'分配角色'" v-model="assignRoleDialogVisible" width="500px">
      <el-form>
        <el-form-item label="角色列表">
          <el-select v-model="userRolesVo.roleIds" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4"
            placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roleOptions" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssignRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.el-icon {
  margin-right: 4px;
}

.el-table {
  --el-table-border-color: #ebeef5;
  --el-table-header-background-color: #f5f7fa;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.total-count {
  font-size: 14px;
  color: #606266;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
