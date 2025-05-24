<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Delete, View } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getOperLogPage, deleteOperLog, cleanOperLog } from '@/api/monitor/operateLog';
import { formatDate } from '@/utils/format';

// 搜索表单
const searchForm = ref({
  operateIp: null,
  title: null, 
  userId: null,
  operateStatus: null,
  pageNo: 1,
  pageSize: 10
});

// 操作状态标签映射
const operateStatusTagMap = {
  "0": { type: 'success', label: '正常' },
  "1": { type: 'danger', label: '异常' }
};

// 表格数据
const tableData = ref([]);
const total = ref(0);
const loading = ref(true);
const selectedRows = ref([]); 
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const open = ref(false);

// 查看详情表单
const form = ref({} as any);

/** 查询操作日志列表 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await getOperLogPage(searchForm.value);
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
  ids.value = selection.map(item => item.operateId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 查看详细按钮操作 */
const handleView = (row: any) => {
  open.value = true;
  form.value = row;
}

/** 删除按钮操作 */
const handleDelete = (row: any) => {
  const operateIds = row.operateId || ids.value;
  ElMessageBox.confirm('是否确认删除日志编号为"' + operateIds + '"的数据项?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消", 
    type: "warning"
  }).then(async () => {
    await deleteOperLog(operateIds);
    ElMessage.success("删除成功");
    getList();
  }).catch(() => {
    ElMessage.info("已取消删除");
  });
}

/** 清空按钮操作 */
const handleClean = () => {
  ElMessageBox.confirm("是否确认清空所有操作日志数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await cleanOperLog();
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
        <el-form-item label="操作地址" prop="operateIp">
          <el-input 
            v-model="searchForm.operateIp" 
            placeholder="请输入操作地址" 
            clearable 
            style="width: 240px" 
            @keyup.enter="handleSearch" 
          />
        </el-form-item>
        <el-form-item label="系统模块" prop="title">
          <el-input 
            v-model="searchForm.title" 
            placeholder="请输入系统模块" 
            clearable 
            style="width: 240px"
            @keyup.enter="handleSearch" 
          />
        </el-form-item>
        <el-form-item label="操作人员" prop="userId">
          <el-input 
            v-model="searchForm.userId" 
            placeholder="请输入操作人员" 
            clearable 
            style="width: 240px"
            @keyup.enter="handleSearch" 
          />
        </el-form-item>
        <el-form-item label="操作状态" prop="operateStatus">
          <el-select 
            v-model="searchForm.operateStatus" 
            placeholder="操作状态" 
            clearable 
            style="width: 240px"
          >
            <el-option 
              v-for="(value, key) in operateStatusTagMap" 
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
        <el-table-column label="日志编号" align="center" prop="operateId" />
        <el-table-column label="系统模块" align="center" prop="title" :show-overflow-tooltip="true" />
        <el-table-column label="请求方式" align="center" prop="requestMethod" />
        <el-table-column label="操作人员" align="center" prop="userId" width="120" :show-overflow-tooltip="true" />
        <el-table-column label="操作地址" align="center" prop="operateIp" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="操作状态" align="center" prop="operateStatus" width="100">
          <template #default="scope">
            <el-tag :type="operateStatusTagMap[scope.row.operateStatus]?.type">
              {{ operateStatusTagMap[scope.row.operateStatus]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作日期" align="center" prop="createTime" width="180" sortable="custom">
          <template #default="scope">
            <span>{{ formatDate(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消耗时间" align="center" prop="costTime" width="110">
          <template #default="scope">
            <span>{{ scope.row.costTime }}毫秒</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="primary" :icon="View" @click="handleView(scope.row)">详细</el-button>
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

      <!-- 查看详情对话框 -->
      <el-dialog 
        title="操作日志详情" 
        v-model="open" 
        width="800px" 
        append-to-body
      >
        <el-form :model="form" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作模块：">{{ form.title }}</el-form-item>
              <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求URL：">{{ form.operateUrl }}</el-form-item>
              <el-form-item label="操作地址：">{{ form.operateIp }} {{ form.operateLocation }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="请求参数：">{{ form.operateParam }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作状态：">
                <el-tag :type="operateStatusTagMap[form.operateStatus]?.type">
                  {{ operateStatusTagMap[form.operateStatus]?.label }}
                </el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作时间：">{{ formatDate(form.createTime) }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="form.operateStatus === '1'" label="异常信息：">{{ form.errorMsg }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="open = false">关 闭</el-button>
          </div>
        </template>
      </el-dialog>
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