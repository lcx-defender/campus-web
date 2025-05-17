<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Delete, Unlock, Download } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getLogInfoPage, deleteLoginInfo, clearLoginInfo } from '@/api/monitor/loginInfo';
import { formatDate } from '@/utils/format';

// 搜索表单
const searchForm = ref({
  ipaddr: null,
  userName: null,
  status: null,
  pageNo: 1,
  pageSize: 10
});

// 登录状态标签映射
const loginStatusTagMap = {
  "0": { type: 'success', label: '成功' },
  "1": { type: 'danger', label: '失败' }
};

// 表格数据
const tableData = ref([]);
const total = ref(0);
const loading = ref(true);
const selectedRows = ref([]);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);

/** 查询登录日志列表 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await getLogInfoPage(searchForm.value);
    tableData.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}

/** 搜索按钮操作 */
const handleSearch = () => {
  searchForm.value.pageNo = 1;
  getList();
}

/** 重置按钮操作 */
const handleReset = () => {
  Object.keys(searchForm.value).forEach(key => {
    searchForm.value[key] = '';
  });
  searchForm.value.pageNo = 1;
  searchForm.value.pageSize = 10;
  ElMessage.success('重置搜索条件');
  getList();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
  ids.value = selection.map(item => item.infoId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 删除按钮操作 */
const handleDelete = (row: any) => {
  const infoIds = row.infoId || ids.value;
  ElMessageBox.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteLoginInfo(infoIds);
    ElMessage.success("删除成功");
    getList();
  }).catch(() => {
    ElMessage.info("已取消删除");
  });
}

/** 清空按钮操作 */
const handleClean = () => {
  ElMessageBox.confirm("是否确认清空所有登录日志数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await clearLoginInfo();
    ElMessage.success("清空成功");
    getList();
  }).catch(() => {
    ElMessage.info("已取消清空");
  });
}

/** 分页大小改变 */
const handleSizeChange = (val: number) => {
  searchForm.value.pageSize = val;
  getList();
}

/** 分页页码改变 */
const handleCurrentChange = (val: number) => {
  searchForm.value.pageNo = val;
  getList();
}

getList();
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- 搜索表单 -->
      <el-form :model="searchForm" :inline="true" label-width="68px">
        <el-form-item label="登录地址" prop="ipaddr">
          <el-input
            v-model="searchForm.ipaddr"
            placeholder="请输入登录地址"
            clearable
            style="width: 240px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="searchForm.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="searchForm.status"
            placeholder="登录状态"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="(value, key) in loginStatusTagMap"
              :key="key"
              :label="value.label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="danger" plain :icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain :icon="Delete" @click="handleClean">清空</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="访问编号" align="center" prop="infoId" />
        <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
        <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
        <el-table-column label="登录状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="loginStatusTagMap[scope.row.status]?.type">
              {{ loginStatusTagMap[scope.row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
          <template #default="scope">
            <span>{{ formatDate(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="msg" :show-overflow-tooltip="true" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="searchForm.pageNo"
        v-model:page-size="searchForm.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
      />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
  background-color: #f5f7fa;
}

.content-wrapper {
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.mb8 {
  margin-bottom: 8px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

:deep(.el-form--inline .el-form-item) {
  margin-bottom: 16px;
}
</style>