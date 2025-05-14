<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import { getDeptTree, getDeptTreeSelect, addDept, deleteDept, updateDept, updateDeptStatus } from '@/api/system/dept';
import { getCurrentInstance } from 'vue';
import { formatDate } from '@/utils/format'

// 查询表单
const searchForm = ref({
  deptName: null,
  status: null,
});

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const refreshTable = ref(true);
const isExpand = ref(false);

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref('新增部门');
const deptOptions = ref([]);
const formRef = ref();

// 表单数据
const formData = ref({
  deptId: undefined,
  parentId: undefined,
  level: undefined,
  deptName: '',
  leader: '',
  phone: '',
  email: '',
  status: '1',
  remark: ''
});


// 表单验证规则
const rules = {
  deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
  level: [{ required: true, message: '请选择部门级别', trigger: 'change' }],
};

// 部门级别选项
const levelOptions = [
  { value: 1, label: '学校' },
  { value: 2, label: '学院' },
  { value: 3, label: '系' },
  { value: 4, label: '专业' },
  { value: 5, label: '班级' },
];

// 获取部门树数据
const getDeptTreeData = async () => {
  loading.value = true;
  try {
    const res = await getDeptTree(searchForm.value);
    tableData.value = res.data;
  } finally {
    loading.value = false;
  }
}

const getDeptOption = async () => {
  deptOptions.value = [];
  const res = await getDeptTreeSelect();
  const rootDept = { value: 0, label: "主部门", children: [] };
  rootDept.children = res.data;
  deptOptions.value.push(rootDept);
}

// 搜索方法
const handleSearch = () => {
  getDeptTreeData();
}

// 重置搜索
const searchFormReset = () => {
  searchForm.value.deptName = null;
  searchForm.value.status = null;
  getDeptTreeData();
}

// 新增方法
const handleAdd = async (row?: any) => {
  dialogTitle.value = '新增部门';
  await getDeptOption();
  dialogVisible.value = true;
  formData.value = {
    deptId: undefined,
    parentId: row?.deptId || undefined,
    level: undefined,
    deptName: '',
    leader: '',
    phone: '',
    email: '',
    status: '1',
    remark: ''
  };
}

// 修改方法
const handleEdit = async (row: any) => {
  dialogTitle.value = '修改部门';
  await getDeptOption();
  dialogVisible.value = true;
  Object.assign(formData.value, row);
}

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate();
  try {
    if (dialogTitle.value === '新增部门') {
      await addDept(formData.value);
    } else {
      await updateDept(formData.value);
    }
    dialogVisible.value = false;
    getDeptTreeData();
  } catch (error) {
    console.error('保存失败:', error);
  }
}

// 删除方法
const handleDelete = async (row: any) => {
  try {
    await deleteDept(row.deptId);
    getDeptTreeData();
  } catch (error) {
    console.error('删除失败:', error);
  }
}

const handleExpand = () => {
  refreshTable.value = false;
  isExpand.value = !isExpand.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

getDeptTreeData();
</script>

<template>
  <div class="dept-manage">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input v-model="searchForm.deptName" placeholder="请输入部门名称" style="width: 200px" />
      <el-select v-model="searchForm.status" placeholder="部门状态" style="width: 120px; margin-left: 10px">
        <el-option label="正常" value="1" />
        <el-option label="停用" value="0" />
      </el-select>
      <el-button type="primary" @click="handleSearch" style="margin-left: 10px">搜索</el-button>
      <el-button @click="searchFormReset">重置</el-button>
    </div>

    <!-- 操作按钮 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button @click="handleExpand">展开/折叠</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-if="refreshTable" :data="tableData" row-key="deptId" :default-expand-all="isExpand"
      :tree-props="{ children: 'children' }" v-loading="loading">
      <el-table-column prop="deptName" label="部门名称" :show-overflow-tooltip="true" />
      <el-table-column prop="status" label="部门状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">修改</el-button>
          <el-button type="primary" link @click="handleAdd(row)">新增</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" append-to-body>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select v-model="formData.parentId" :data="deptOptions" :props="{
            label: 'label',
            value: 'value',
            children: 'children'
          }" check-strictly placeholder="选择上级部门" />
        </el-form-item>
        <el-form-item label="部门级别" prop="level">
          <el-select v-model="formData.level" placeholder="请选择部门级别">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="formData.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="formData.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="部门状态">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.dept-manage {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}
</style>