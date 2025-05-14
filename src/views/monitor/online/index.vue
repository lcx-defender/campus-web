<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUserOnlinePage, forceLogout } from '@/api/monitor/onlineUser';
import { formatDate } from '@/utils/format';

// 搜索表单
const searchForm = ref({
  ipaddr: null,
  userName: null,
  pageNo: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref([]);
const total = ref(0);
const loading = ref(true);
const selectedRows = ref([]);

/** 查询在线用户列表 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await getUserOnlinePage(searchForm.value);
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

/** 强退按钮操作 */
const handleForceLogout = (row: any) => {
  ElMessageBox.confirm('是否确认强退该用户?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await forceLogout(row.tokenId);
    ElMessage.success("强退成功");
    getList();
  }).catch(() => {
    ElMessage.info("已取消操作");
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
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
        <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
        <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
        <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
        <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
          <template #default="scope">
            <span>{{ formatDate(scope.row.loginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" :icon="Delete" @click="handleForceLogout(scope.row)">强退</el-button>
          </template>
        </el-table-column>
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

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

:deep(.el-form--inline .el-form-item) {
  margin-bottom: 16px;
}
</style>