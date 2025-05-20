<script lang="ts" setup>
import { ref } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getLeaveInfoPage, approveLeaveInfo, rejectLeaveInfo } from "@/api/campus/leaveInfo";
import { formatDate } from '@/utils/format';

const leaveTypeMap = {
    '1': '住宿请假',
    '2': '课堂请假'
};

const approvalStatusMap = {
    '0': '待审批',
    '1': '已通过',
    '2': '已驳回'
};

const isOffCampusMap = {
    '0': '否',
    '1': '是'
};

const searchForm = ref({
    leaveType: null,
    approvalStatus: null,
    applicant: null,
    pageNo: 1,
    pageSize: 10
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(true);

// 查看详情对话框
const detailDialogVisible = ref(false);
const currentLeaveInfo = ref(null);

// 获取请假信息列表
const getList = async () => {
    loading.value = true;
    try {
        const response = await getLeaveInfoPage(searchForm.value);
        tableData.value = response.data.list;
        total.value = response.data.total;
    } finally {
        loading.value = false;
    }
};

// 打开审批对话框
const handleApproval = (row) => {
    currentLeaveInfo.value = row;
    detailDialogVisible.value = true;
};

// 同意请假
const handleApprove = async () => {
    try {
        loading.value = true;
        await approveLeaveInfo(currentLeaveInfo.value.leaveInfoId);
        ElMessage.success('审批通过成功');
        detailDialogVisible.value = false;
        getList();
    } catch (error) {
        ElMessage.error('操作失败：' + (error.message || '未知错误'));
    } finally {
        loading.value = false;
    }
};

// 驳回请假
const handleReject = async () => {
    try {
        loading.value = true;
        await rejectLeaveInfo(currentLeaveInfo.value.leaveInfoId);
        ElMessage.success('驳回成功');
        detailDialogVisible.value = false;
        getList();
    } catch (error) {
        ElMessage.error('操作失败：' + (error.message || '未知错误'));
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
        leaveType: null,
        approvalStatus: null,
        applicant: null,
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
                <el-select v-model="searchForm.leaveType" placeholder="请选择请假类型" clearable>
                    <el-option v-for="(value, key) in leaveTypeMap" :key="key" :label="value" :value="key" />
                </el-select>
                <el-select v-model="searchForm.approvalStatus" placeholder="请选择审批状态" clearable>
                    <el-option v-for="(value, key) in approvalStatusMap" :key="key" :label="value" :value="key" />
                </el-select>
                <el-input v-model="searchForm.applicant" placeholder="请输入申请人" clearable />
            </div>
            <div class="button-group">
                <el-button type="primary" class="!rounded-button" @click="handleSearch">
                    <el-icon><Search /></el-icon>搜索
                </el-button>
                <el-button class="!rounded-button" @click="handleReset">
                    <el-icon><Refresh /></el-icon>重置
                </el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column prop="leaveType" label="请假类型" align="center">
                    <template #default="scope">
                        {{ leaveTypeMap[scope.row.leaveType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" align="center">
                    <template #default="scope">
                        {{ formatDate(scope.row.startTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center">
                    <template #default="scope">
                        {{ formatDate(scope.row.endTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="isOffCampus" label="是否校外" align="center">
                    <template #default="scope">
                        {{ isOffCampusMap[scope.row.isOffCampus] }}
                    </template>
                </el-table-column>
                <el-table-column prop="emergencyContact" label="紧急联系人" align="center" />
                <el-table-column prop="destination" label="去向" align="center" />
                <el-table-column prop="reason" label="请假事由" align="center" show-overflow-tooltip />
                <el-table-column prop="applicant" label="申请人" align="center" />
                <el-table-column prop="approvalStatus" label="审批状态" align="center">
                    <template #default="scope">
                        {{ approvalStatusMap[scope.row.approvalStatus] }}
                    </template>
                </el-table-column>
                <el-table-column prop="approvalTime" label="审批时间" align="center">
                    <template #default="scope">
                        {{ formatDate(scope.row.approvalTime) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleApproval(scope.row)"
                            :disabled="scope.row.approvalStatus !== '0'">
                            审批
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
        <el-dialog title="请假详情" v-model="detailDialogVisible" width="600px" append-to-body>
            <el-descriptions :column="2" border>
                <el-descriptions-item label="请假类型">{{ leaveTypeMap[currentLeaveInfo?.leaveType] }}</el-descriptions-item>
                <el-descriptions-item label="申请人">{{ currentLeaveInfo?.applicant }}</el-descriptions-item>
                <el-descriptions-item label="开始时间">{{ formatDate(currentLeaveInfo?.startTime) }}</el-descriptions-item>
                <el-descriptions-item label="结束时间">{{ formatDate(currentLeaveInfo?.endTime) }}</el-descriptions-item>
                <el-descriptions-item label="是否校外">{{ isOffCampusMap[currentLeaveInfo?.isOffCampus] }}</el-descriptions-item>
                <el-descriptions-item label="紧急联系人">{{ currentLeaveInfo?.emergencyContact }}</el-descriptions-item>
                <el-descriptions-item label="去向">{{ currentLeaveInfo?.destination }}</el-descriptions-item>
                <el-descriptions-item label="请假事由" :span="2">{{ currentLeaveInfo?.reason }}</el-descriptions-item>
                <el-descriptions-item label="附件" :span="2">
                    <div class="attachment-list">
                        <el-image v-if="currentLeaveInfo?.attachmentUrl1" :src="currentLeaveInfo.attachmentUrl1"
                            :preview-src-list="[currentLeaveInfo.attachmentUrl1]" fit="cover" class="attachment-image" />
                        <el-image v-if="currentLeaveInfo?.attachmentUrl2" :src="currentLeaveInfo.attachmentUrl2"
                            :preview-src-list="[currentLeaveInfo.attachmentUrl2]" fit="cover" class="attachment-image" />
                        <el-image v-if="currentLeaveInfo?.attachmentUrl3" :src="currentLeaveInfo.attachmentUrl3"
                            :preview-src-list="[currentLeaveInfo.attachmentUrl3]" fit="cover" class="attachment-image" />
                        <el-image v-if="currentLeaveInfo?.attachmentUrl4" :src="currentLeaveInfo.attachmentUrl4"
                            :preview-src-list="[currentLeaveInfo.attachmentUrl4]" fit="cover" class="attachment-image" />
                    </div>
                </el-descriptions-item>
            </el-descriptions>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="success" @click="handleApprove">同意</el-button>
                    <el-button type="danger" @click="handleReject">驳回</el-button>
                    <el-button @click="detailDialogVisible = false">取消</el-button>
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

.attachment-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.attachment-image {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    cursor: pointer;
}
</style>