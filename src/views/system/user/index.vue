<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Plus, Edit, Lock, Close, Key, Search, Refresh, Unlock } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listUser, getUser, delUser, addUser, updateUser, banUser, recoverUser } from "@/api/system/user";
import { fa } from 'element-plus/es/locale';
import { get } from 'lodash';
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
  0: '系统管理&程序员',
  1: '教师',
  2: '学生',
};
const userStatusTagMap = {
  0: { type: 'success', label: '正常' },
  1: { type: 'warning', label: '封禁' },
  2: { type: 'danger', label: '删除' },
};
const sexMap = {
  0: '男',
  1: '女',
  2: '保密',
};
const tableData = ref([]);
const total = ref(0);
const loading = ref(true);
const selectedRows = ref([]); // 批量操作选中的行数据
const ids = ref([]); // 批量操作的用户ID数组
const single = ref(true);
const multiple = ref(false);

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
  single.value = val.length === 1;
  multiple.value = !val.length;
};
const handleAdd = () => {
  ElMessage.success('点击了新增按钮');
};
const handleModify = () => {
  ElMessage.success('点击了修改按钮');
};
const handleLogout = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要注销的用户');
    return;
  }
  ElMessage.success('点击了注销按钮');
};
const handleRowEdit = (row: any) => {
  ElMessage.success(`修改用户：${row.nickname}`);
};
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
        <el-button type="danger" class="!rounded-button" @click="handleLogout">
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
        <el-table-column type="selection" width="55" />
        <el-table-column prop="nickname" label="用户昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="sex" label="性别" width="80">
          <template #default="scope">
            {{ sexMap[scope.row.sex] }}
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型">
          <template #default="scope">
            {{ userTypeMap[scope.row.userType] }}
          </template>
        </el-table-column>
        <el-table-column prop="userStatus" label="用户状态">
          <template #default="scope">
            <el-tag :type="userStatusTagMap[scope.row.userStatus].type">
              {{ userStatusTagMap[scope.row.userStatus].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="200">
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
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <span class="total-count">共 {{ total }} 条</span>
        <el-pagination v-model:current-page="searchForm.pageNo" v-model:page-size="searchForm.pageSize"
          :page-sizes="[10, 20, 30, 50]" :total="total" layout="sizes, prev, pager, next"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
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
