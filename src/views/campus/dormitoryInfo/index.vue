<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Plus, Edit, Search, Refresh, Upload, Download, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getDormitoryInfoPage, addDormitoryInfo, editDormitoryInfo, addBatchDormitoryInfo, deleteDormitoryInfo, exportDormitoryInfo } from "@/api/campus/dormitoryInfo";

const searchForm = ref({
    studentId: null,
    dormitoryId: null,
    roomId: null,
    bedId: null,
    studentName: null,
    pageNo: 1,
    pageSize: 10
});
const tableData = ref([]);
const total = ref(0);
const loading = ref(true);
const selectedRows = ref([]);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);

const dialogVisible = ref(false);
const dialogTitle = ref('新增宿舍信息');
const formRef = ref(null);
const form = ref({
    id: null,
    studentId: null,
    dormitoryId: null,
    roomId: null,
    bedId: null
});

// 表单验证规则
const rules = {
    studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    dormitoryId: [{ required: true, message: '请输入宿舍楼号', trigger: 'blur' }],
    roomId: [{ required: true, message: '请输入房间号', trigger: 'blur' }],
    bedId: [{ required: true, message: '请输入床位号', trigger: 'blur' }]
};

// 重置表单
const resetForm = () => {
    form.value = {
        id: null,
        studentId: null,
        dormitoryId: null,
        roomId: null,
        bedId: null
    };
    formRef.value?.resetFields();
};

// 获取宿舍信息列表
const getList = async () => {
    loading.value = true;
    try {
        const response = await getDormitoryInfoPage(searchForm.value);
        tableData.value = response.data.list;
        total.value = response.data.total;
    } finally {
        loading.value = false;
    }
};

// 表格选择变化
const handleSelectionChange = (val) => {
    selectedRows.value = val;
    ids.value = val.map(item => item.id);
    single.value = val.length !== 1;
    multiple.value = !val.length;
};

// 打开新增对话框
const handleAdd = () => {
    resetForm();
    dialogTitle.value = '新增宿舍信息';
    dialogVisible.value = true;
};

// 打开编辑对话框
const handleEdit = (row) => {
    resetForm();
    dialogTitle.value = '编辑宿舍信息';
    form.value = { ...row };
    dialogVisible.value = true;
};

// 提交表单
const submitForm = async () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                loading.value = true;
                if (form.value.id) {
                    await editDormitoryInfo(form.value);
                    ElMessage.success('修改成功');
                } else {
                    await addDormitoryInfo(form.value);
                    ElMessage.success('添加成功');
                }
                dialogVisible.value = false;
                getList();
            } finally {
                loading.value = false;
            }
        }
    });
};

// 删除宿舍信息
const handleDelete = async (row) => {
    const idsToDelete = row ? [row.id] : ids.value;
    ElMessageBox.confirm('是否确认删除选中的宿舍信息?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            loading.value = true;
            await deleteDormitoryInfo(idsToDelete.join(','));
            ElMessage.success('删除成功');
            getList();
        } finally {
            loading.value = false;
        }
    });
};

// 导入导出
const handleImport = async (file) => {
    const formData = new FormData();
    formData.append('file', file.raw);
    try {
        loading.value = true;
        await addBatchDormitoryInfo(formData);
        ElMessage.success('导入成功');
        getList();
    } catch (error) {
        ElMessage.error('导入失败');
    } finally {
        loading.value = false;
    }
};

const handleExport = async () => {
    try {
        loading.value = true;
        const response = await exportDormitoryInfo(searchForm.value);
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = '宿舍信息.xlsx';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);
        ElMessage.success('导出成功');
    } catch (error) {
        ElMessage.error('导出失败：' + (error.message || '未知错误'));
    } finally {
        loading.value = false;
    }
};

const handleSizeChange = (val) => {
    searchForm.value.pageSize = val;
    getList();
};

const handleCurrentChange = (val) => {
    searchForm.value.pageNo = val;
    getList();
};

const handleSearch = () => {
    searchForm.value.pageNo = 1;
    getList();
};

const handleReset = () => {
    searchForm.value = {
        studentId: null,
        dormitoryId: null,
        roomId: null,
        bedId: null,
        studentName: null,
        pageNo: 1,
        pageSize: 10
    };
    getList();
};

getList();
</script>

<template>
    <div class="page-container">
        <div class="content-wrapper">
            <div class="search-form">
                <el-input v-model="searchForm.studentId" placeholder="请输入学号" clearable />
                <el-input v-model="searchForm.dormitoryId" placeholder="请输入宿舍楼号" clearable />
                <el-input v-model="searchForm.roomId" placeholder="请输入房间号" clearable />
                <el-input v-model="searchForm.bedId" placeholder="请输入床位号" clearable />
            </div>
            <div class="button-group">
                <el-button type="primary" class="!rounded-button" @click="handleSearch">
                    <el-icon><Search /></el-icon>搜索
                </el-button>
                <el-button class="!rounded-button" @click="handleReset">
                    <el-icon><Refresh /></el-icon>重置
                </el-button>
            </div>
            <div class="button-group">
                <el-button type="primary" class="!rounded-button" @click="handleAdd">
                    <el-icon><Plus /></el-icon>新增
                </el-button>
                <el-button type="danger" class="!rounded-button" @click="handleDelete" :disabled="multiple">
                    <el-icon><Delete /></el-icon>删除
                </el-button>
                <el-upload :show-file-list="false" :before-upload="handleImport" accept=".xlsx,.xls">
                    <el-button type="success" class="!rounded-button">
                        <el-icon><Upload /></el-icon>导入
                    </el-button>
                </el-upload>
                <el-button type="warning" class="!rounded-button" @click="handleExport">
                    <el-icon><Download /></el-icon>导出
                </el-button>
            </div>

            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="studentId" label="学号" align="center" />
                <el-table-column prop="dormitoryId" label="宿舍楼号" align="center" />
                <el-table-column prop="roomId" label="房间号" align="center" />
                <el-table-column prop="bedId" label="床位号" align="center" />
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="primary" link :icon="Edit" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="danger" link :icon="Delete" @click="handleDelete(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-wrapper">
                <span class="total-count">共 {{ total }} 条</span>
                <el-pagination
                    v-model:current-page="searchForm.pageNo"
                    v-model:page-size="searchForm.pageSize"
                    :page-sizes="[10, 20, 30, 50]"
                    :total="total"
                    layout="sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>

        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="学号" prop="studentId">
                    <el-input v-model="form.studentId" placeholder="请输入学号" />
                </el-form-item>
                <el-form-item label="宿舍楼号" prop="dormitoryId">
                    <el-input v-model="form.dormitoryId" placeholder="请输入宿舍楼号" />
                </el-form-item>
                <el-form-item label="房间号" prop="roomId">
                    <el-input v-model="form.roomId" placeholder="请输入房间号" />
                </el-form-item>
                <el-form-item label="床位号" prop="bedId">
                    <el-input v-model="form.bedId" placeholder="请输入床位号" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </div>
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
</style>