<script setup>
import { ref, reactive } from 'vue';
import { Plus, Edit, Search, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTeacherPage, addTeacherService, editTeacherService, getTeacherUserPage } from "@/api/campus/teacher";
import { formatDate } from '@/utils/format'

// 查询表单
const searchForm = ref({
    teacherName: null,
    teacherId: null,
    deptId: null,
    pageNo: 1,
    pageSize: 10
});

// 表格数据
const tableData = ref([]);
const total = ref(0);
const loading = ref(true);

// 字典数据
const sexMap = {
    "0": '男',
    "1": '女',
    "2": '保密',
};

const positionStatusMap = {
    "0": "在职",
    "1": "停职",
    "2": "离职"
};

// 新增表单
const addDialogVisible = ref(false);
const addFormRef = ref(null);
const addForm = ref({
    nickname: null,           // 用户昵称
    identity: null,           // 身份证号
    email: null,             // 邮箱
    phone: null,             // 手机号码
    sex: null,               // 性别
    password: null,          // 密码
    teacherId: null,         // 教师工号
    teacherName: null,       // 教师姓名
    deptId: null,            // 部门代码
    title: null,             // 职称
    office: null,            // 办公室
    admitTime: null,         // 入职时间
    positionStatus: 0        // 职位状态
});

// 编辑表单
const editDialogVisible = ref(false);
const editFormRef = ref(null);
const editForm = ref({
    userId: null,            // 用户ID
    nickname: null,          // 用户昵称
    userType: '1',          // 用户类型（固定为教师）
    identity: null,          // 身份证号
    email: null,            // 邮箱
    phone: null,            // 手机号码
    sex: null,              // 性别
    avatar: null,           // 头像
    userStatus: '0',        // 账号状态
    teacherId: null,        // 教师工号
    teacherName: null,      // 教师姓名
    deptId: null,           // 部门代码
    title: null,            // 职称
    office: null,           // 办公室
    admitTime: null,        // 入职时间
    positionStatus: null    // 职位状态
});

// 表单验证规则
const addRules = {
    identity: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    teacherName: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
    deptId: [{ required: true, message: '请输入部门代码', trigger: 'blur' }],
};

const editRules = {
    identity: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
    teacherName: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
    deptId: [{ required: true, message: '请输入部门代码', trigger: 'blur' }],
};

// 获取教师列表
const getList = async () => {
    loading.value = true;
    try {
        const response = await getTeacherUserPage(searchForm.value);
        tableData.value = response.data.list;
        total.value = response.data.total;
    } finally {
        loading.value = false;
    }
}

// 重置表单
const resetAddForm = () => {
    addForm.value = {
        nickname: null,
        identity: null,
        email: null,
        phone: null,
        sex: null,
        password: null,
        teacherId: null,
        teacherName: null,
        deptId: null,
        title: null,
        office: null,
        admitTime: null,
        positionStatus: 0
    };
    addFormRef.value?.resetFields();
};

const resetEditForm = () => {
    editForm.value = {
        userId: null,
        nickname: null,
        userType: '1',
        identity: null,
        email: null,
        phone: null,
        sex: null,
        avatar: null,
        userStatus: '0',
        teacherId: null,
        teacherName: null,
        deptId: null,
        title: null,
        office: null,
        admitTime: null,
        positionStatus: null
    };
    editFormRef.value?.resetFields();
};

// 添加教师
const handleAdd = () => {
    resetAddForm();
    addDialogVisible.value = true;
};

// 编辑教师
const handleEdit = (row) => {
    resetEditForm();
    editForm.value = { ...row };
    editDialogVisible.value = true;
};

// 提交表单
const submitAddForm = async () => {
    addFormRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                loading.value = true;
                await addTeacherService(addForm.value);
                ElMessage.success('添加成功');
                addDialogVisible.value = false;
                getList();
            } finally {
                loading.value = false;
            }
        }
    });
};

const submitEditForm = async () => {
    editFormRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                loading.value = true;
                await editTeacherService(editForm.value);
                ElMessage.success('修改成功');
                editDialogVisible.value = false;
                getList();
            } finally {
                loading.value = false;
            }
        }
    });
};

// 分页处理
const handleSizeChange = (val) => {
    searchForm.value.pageSize = val;
    getList();
};

const handleCurrentChange = (val) => {
    searchForm.value.pageNo = val;
    getList();
};

// 搜索和重置
const handleSearch = () => {
    searchForm.value.pageNo = 1;
    getList();
};

const handleReset = () => {
    searchForm.value = {
        teacherName: null,
        teacherId: null,
        deptId: null,
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
            <!-- 搜索表单 -->
            <div class="search-form">
                <el-input v-model="searchForm.teacherName" placeholder="请输入教师姓名" clearable />
                <el-input v-model="searchForm.teacherId" placeholder="请输入工号" clearable />
                <el-input v-model="searchForm.deptId" placeholder="请输入部门代码" clearable />
            </div>

            <!-- 按钮组 -->
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
                <el-button type="primary" class="!rounded-button" @click="handleAdd">
                    <el-icon>
                        <Plus />
                    </el-icon>新增
                </el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column prop="teacherId" label="工号" align="center" />
                <el-table-column prop="teacherName" label="姓名" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="nickname" label="昵称" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="identity" label="身份证号" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="email" label="邮箱" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="phone" label="手机号" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="sex" label="性别" align="center">
                    <template #default="scope">
                        {{ sexMap[scope.row.sex] }}
                    </template>
                </el-table-column>
                <el-table-column prop="deptId" label="部门代码" align="center" />
                <el-table-column prop="title" label="职称" align="center" />
                <el-table-column prop="office" label="办公室" align="center" />
                <el-table-column prop="positionStatus" label="职位状态" align="center">
                    <template #default="scope">
                        {{ positionStatusMap[scope.row.positionStatus] }}
                    </template>
                </el-table-column>
                <el-table-column prop="admitTime" label="入职时间" align="center" :show-overflow-tooltip="true">
                    <template #default="scope">
                        {{ formatDate(scope.row.admitTime) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <el-button type="primary" link :icon="Edit" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
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
        <el-dialog title="新增教师" v-model="addDialogVisible" width="700px" append-to-body>
            <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
                <!-- 用户信息 -->
                <el-divider content-position="left">用户信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="identity">
                            <el-input v-model="addForm.identity" placeholder="请输入身份证号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="addForm.sex" placeholder="请选择性别">
                                <el-option v-for="(label, value) in sexMap" :key="value" :label="label"
                                    :value="value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addForm.password" type="password" placeholder="请输入密码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="addForm.nickname" placeholder="请输入昵称" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addForm.email" placeholder="请输入邮箱" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="addForm.phone" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-divider content-position="left">教师信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="工号" prop="teacherId">
                            <el-input v-model="addForm.teacherId" placeholder="请输入工号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="teacherName">
                            <el-input v-model="addForm.teacherName" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="部门代码" prop="deptId">
                            <el-input v-model="addForm.deptId" placeholder="请输入部门代码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职称" prop="title">
                            <el-input v-model="addForm.title" placeholder="请输入职称" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="办公室" prop="office">
                            <el-input v-model="addForm.office" placeholder="请输入办公室" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入职时间" prop="admitTime">
                            <el-date-picker v-model="addForm.admitTime" type="datetime" placeholder="请选择入职时间" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="职位状态" prop="positionStatus">
                    <el-select v-model="addForm.positionStatus" placeholder="请选择职位状态">
                        <el-option v-for="(label, value) in positionStatusMap" :key="value" :label="label"
                            :value="Number(value)" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitAddForm">确 定</el-button>
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog title="编辑教师" v-model="editDialogVisible" width="700px" append-to-body>
            <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
                <!-- 用户信息 -->
                <el-divider content-position="left">用户信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="identity">
                            <el-input v-model="editForm.identity" placeholder="请输入身份证号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="editForm.sex" placeholder="请选择性别">
                                <el-option v-for="(label, value) in sexMap" :key="value" :label="label"
                                    :value="value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="editForm.email" placeholder="请输入邮箱" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="editForm.phone" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 教师信息 -->
                <el-divider content-position="left">教师信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="工号" prop="teacherId">
                            <el-input v-model="editForm.teacherId" placeholder="请输入工号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="teacherName">
                            <el-input v-model="editForm.teacherName" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="部门代码" prop="deptId">
                            <el-input v-model="editForm.deptId" placeholder="请输入部门代码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职称" prop="title">
                            <el-input v-model="editForm.title" placeholder="请输入职称" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="办公室" prop="office">
                            <el-input v-model="editForm.office" placeholder="请输入办公室" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入职时间" prop="admitTime">
                            <el-date-picker v-model="editForm.admitTime" type="datetime" placeholder="请选择入职时间" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="职位状态" prop="positionStatus">
                            <el-select v-model="editForm.positionStatus" placeholder="请选择职位状态">
                                <el-option v-for="(label, value) in positionStatusMap" :key="value" :label="label"
                                    :value="Number(value)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitEditForm">确 定</el-button>
                    <el-button @click="editDialogVisible = false">取 消</el-button>
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
    grid-template-columns: repeat(3, 1fr);
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