<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Plus, Edit, Search, Refresh, Upload, Download } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getStudentPage, addStudentService, editStudentService, batchAddStudent, batchExportStudent } from "@/api/campus/student";
import { formatDate } from '@/utils/format'

const searchForm = ref({
    studentName: null,
    studentNo: null,
    className: null,
    grade: null,
    pageNo: 1,
    pageSize: 10
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(true);
const selectedRows = ref([]);
const ids = ref([]);
const single = ref(true);
const multiple = ref(false);

const sexMap = {
    "0": '男',
    "1": '女',
    "2": '保密',
};

const academicStatusMap = {
    "0": "未注册",
    "1": "在籍",
    "2": "保留学籍",
    "3": "休学",
    "4": "退学",
    "5": "毕业",
    "6": "结业",
    "7": "肄业"
};

const addDialogVisible = ref(false);
const addFormRef = ref(null);
const addForm = ref({
    nickname: null,           // 用户昵称
    identity: null,           // 身份证号
    email: null,             // 邮箱
    phone: null,             // 手机号码
    sex: null,               // 性别
    password: null,          // 密码
    studentId: null,         // 学号
    studentName: null,       // 姓名
    universityId: null,      // 学校代码
    instituteId: null,       // 学院代码
    majorId: null,           // 专业代码
    classId: null,           // 班级代码
    currentGrade: null,      // 当前年级
    admitTime: null,         // 入学时间
    graduateTime: null,      // 毕业时间
    politicalStatus: null,   // 政治面貌
    ethnic: null,            // 民族
    academicStatus: null,    // 学籍状态
    highSchool: null,        // 高中就读学校
    homeAddress: null        // 家庭住址
});

// 编辑表单
const editDialogVisible = ref(false);
const editFormRef = ref(null);
const editForm = ref({
    userId: null,
    nickname: null,
    userType: '2', // 学生固定为2
    identity: null,
    email: null,
    phone: null,
    sex: null,
    avatar: null,
    password: null,
    userStatus: '0',
    studentId: null,
    studentName: null,
    universityId: null,
    instituteId: null,
    majorId: null,
    classId: null,
    currentGrade: null,
    admitTime: null,
    graduateTime: null,
    politicalStatus: null,
    ethnic: null,
    academicStatus: null,
    highSchool: null,
    homeAddress: null
});

// 表单验证规则
const addRules = {
    identity: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    studentName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    universityId: [{ required: true, message: '请输入学校代码', trigger: 'blur' }],
    instituteId: [{ required: true, message: '请输入学院代码', trigger: 'blur' }],
    majorId: [{ required: true, message: '请输入专业代码', trigger: 'blur' }],
};

const editRules = {
    identity: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    studentName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    universityId: [{ required: true, message: '请输入学校代码', trigger: 'blur' }],
    instituteId: [{ required: true, message: '请输入学院代码', trigger: 'blur' }],
    majorId: [{ required: true, message: '请输入专业代码', trigger: 'blur' }],
};

// 重置表单
const resetAddForm = () => {
    addForm.value = {
        nickname: null,
        identity: null,
        email: null,
        phone: null,
        sex: null,
        password: null,
        studentId: null,
        studentName: null,
        universityId: null,
        instituteId: null,
        majorId: null,
        classId: null,
        currentGrade: null,
        admitTime: null,
        graduateTime: null,
        politicalStatus: null,
        ethnic: null,
        academicStatus: null,
        highSchool: null,
        homeAddress: null
    };
    addFormRef.value?.resetFields();
};

const resetEditForm = () => {
    editForm.value = {
        userId: null,
        nickname: null,           // 用户昵称
        userType: '2',           // 用户类型(学生固定为2)
        identity: null,          // 身份证号
        email: null,             // 邮箱
        phone: null,             // 手机号
        sex: null,               // 性别
        avatar: null,            // 头像
        password: null,          // 密码
        userStatus: '0',         // 账号状态
        studentId: null,         // 学号
        studentName: null,       // 姓名
        universityId: null,      // 学校代码
        instituteId: null,       // 学院代码
        majorId: null,           // 专业代码
        classId: null,           // 班级代码
        currentGrade: null,      // 当前年级
        admitTime: null,         // 入学时间
        graduateTime: null,      // 毕业时间
        politicalStatus: null,   // 政治面貌
        ethnic: null,            // 民族
        academicStatus: null,    // 学籍状态
        highSchool: null,        // 高中就读学校
        homeAddress: null        // 家庭住址
    };
    editFormRef.value?.resetFields();
};

// 获取学生列表
const getList = async () => {
    loading.value = true;
    try {
        const response = await getStudentPage(searchForm.value);
        tableData.value = response.data.list;
        total.value = response.data.total;
    } finally {
        loading.value = false;
    }
}

// 表格选择变化
const handleSelectionChange = (val) => {
    selectedRows.value = val;
    ids.value = val.map(item => item.studentId);
    single.value = val.length <= 1;
    multiple.value = !val.length;
};

// 添加学生
const handleAdd = () => {
    resetAddForm();
    addDialogVisible.value = true;
};

// 编辑学生
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
                await addStudentService(addForm.value);
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
                await editStudentService(editForm.value);
                ElMessage.success('修改成功');
                editDialogVisible.value = false;
                getList();
            } finally {
                loading.value = false;
            }
        }
    });
};

// 导入导出
const handleImport = async (file) => {
    const formData = new FormData();
    formData.append('file', file.raw);
    try {
        loading.value = true;
        await batchAddStudent(formData);
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
        const response = await batchExportStudent(searchForm.value);
        const contentType = response.headers['content-type'];
        if (contentType?.includes('application/json')) {
            const text = await new Response(response.data).text();
            const error = JSON.parse(text);
            ElMessage.error(error.message || '导出失败');
            return;
        }
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // 从响应头中获取文件名
        const contentDisposition = response.headers['content-disposition'];
        let fileName = '学生用户信息.xlsx';
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
            }
        }
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);

        ElMessage.success('导出成功');
    } catch (error) {
        console.error('导出失败:', error);
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
        studentName: null,
        studentNo: null,
        className: null,
        grade: null,
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
                <el-input v-model="searchForm.studentName" placeholder="请输入学生姓名" clearable />
                <el-input v-model="searchForm.studentNo" placeholder="请输入学号" clearable />
                <el-input v-model="searchForm.className" placeholder="请输入班级" clearable />
                <el-input v-model="searchForm.grade" placeholder="请输入年级" clearable />
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
                <el-upload :show-file-list="false" :before-upload="handleImport" accept=".xlsx,.xls">
                    <el-button type="success" class="!rounded-button">
                        <el-icon>
                            <Upload />
                        </el-icon>导入
                    </el-button>
                </el-upload>
                <el-button type="warning" class="!rounded-button" @click="handleExport">
                    <el-icon>
                        <Download />
                    </el-icon>导出
                </el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
                v-loading="loading">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="studentId" label="学号" align="center" />
                <el-table-column prop="studentName" label="姓名" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="nickname" label="昵称" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="identity" label="身份证号" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="email" label="邮箱" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="phone" label="手机号" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="sex" label="性别" align="center">
                    <template #default="scope">
                        {{ sexMap[scope.row.sex] }}
                    </template>
                </el-table-column>
                <el-table-column prop="currentGrade" label="年级" align="center" />
                <el-table-column prop="academicStatus" label="学籍状态" align="center">
                    <template #default="scope">
                        {{ academicStatusMap[scope.row.academicStatus] }}
                    </template>
                </el-table-column>
                <el-table-column prop="admitTime" label="入学时间" align="center" :show-overflow-tooltip="true">
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
        <el-dialog title="新增学生" v-model="addDialogVisible" width="700px" append-to-body>
            <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
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
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="addForm.nickname" placeholder="请输入昵称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addForm.password" type="password" placeholder="请输入密码" />
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
                <el-divider content-position="left">学籍信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="学号" prop="studentId">
                            <el-input v-model="addForm.studentId" placeholder="请输入学号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="studentName">
                            <el-input v-model="addForm.studentName" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="学校代码" prop="universityId">
                            <el-input v-model="addForm.universityId" placeholder="请输入学校代码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学院代码" prop="instituteId">
                            <el-input v-model="addForm.instituteId" placeholder="请输入学院代码" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="专业代码" prop="majorId">
                            <el-input v-model="addForm.majorId" placeholder="请输入专业代码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="班级代码" prop="classId">
                            <el-input v-model="addForm.classId" placeholder="请输入班级代码" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="当前年级" prop="currentGrade">
                            <el-input v-model="addForm.currentGrade" placeholder="请输入当前年级" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学籍状态" prop="academicStatus">
                            <el-select v-model="addForm.academicStatus" placeholder="请选择学籍状态">
                                <el-option v-for="(label, value) in academicStatusMap" :key="value" :label="label"
                                    :value="Number(value)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="入学时间" prop="admitTime">
                            <el-date-picker v-model="addForm.admitTime" type="datetime" placeholder="请选择入学时间" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="毕业时间" prop="graduateTime">
                            <el-date-picker v-model="addForm.graduateTime" type="datetime" placeholder="请选择毕业时间" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="民族" prop="ethnic">
                            <el-input v-model="addForm.ethnic" placeholder="请输入民族" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="政治面貌" prop="politicalStatus">
                            <el-input v-model="addForm.politicalStatus" placeholder="请输入政治面貌" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="高中就读学校" prop="highSchool">
                            <el-input v-model="addForm.highSchool" placeholder="请输入高中就读学校" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="家庭住址" prop="homeAddress">
                            <el-input v-model="addForm.homeAddress" placeholder="请输入家庭住址" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitAddForm">确 定</el-button>
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog title="编辑学生" v-model="editDialogVisible" width="700px" append-to-body>
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
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="editForm.password" type="password" placeholder="请输入密码" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="editForm.email" placeholder="请输入邮箱" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="editForm.phone" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 学籍信息 -->
                <el-divider content-position="left">学籍信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="学号" prop="studentId">
                            <el-input v-model="editForm.studentId" placeholder="请输入学号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="studentName">
                            <el-input v-model="editForm.studentName" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="学校代码" prop="universityId">
                            <el-input v-model="editForm.universityId" placeholder="请输入学校代码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学院代码" prop="instituteId">
                            <el-input v-model="editForm.instituteId" placeholder="请输入学院代码" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="专业代码" prop="majorId">
                            <el-input v-model="editForm.majorId" placeholder="请输入专业代码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="班级代码" prop="classId">
                            <el-input v-model="editForm.classId" placeholder="请输入班级代码" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="当前年级" prop="currentGrade">
                            <el-input v-model="editForm.currentGrade" placeholder="请输入当前年级" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学籍状态" prop="academicStatus">
                            <el-select v-model="editForm.academicStatus" placeholder="请选择学籍状态">
                                <el-option v-for="(label, value) in academicStatusMap" :key="value" :label="label"
                                    :value="Number(value)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="入学时间" prop="admitTime">
                            <el-date-picker v-model="editForm.admitTime" type="datetime" placeholder="请选择入学时间" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="毕业时间" prop="graduateTime">
                            <el-date-picker v-model="editForm.graduateTime" type="datetime" placeholder="请选择毕业时间" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="民族" prop="ethnic">
                            <el-input v-model="editForm.ethnic" placeholder="请输入民族" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="政治面貌" prop="politicalStatus">
                            <el-input v-model="editForm.politicalStatus" placeholder="请输入政治面貌" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="高中就读学校" prop="highSchool">
                            <el-input v-model="editForm.highSchool" placeholder="请输入高中就读学校" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="家庭住址" prop="homeAddress">
                            <el-input v-model="editForm.homeAddress" placeholder="请输入家庭住址" />
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
    grid-template-columns: repeat(4, 1fr);
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