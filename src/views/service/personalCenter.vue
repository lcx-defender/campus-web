<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user.js';
import { updatePasswordService, userInfoService, updateUserInfoService } from '@/api/system/user.js';
import { router } from '@/router/index.js';
import cloneDeep from 'lodash/cloneDeep'; // 引入 lodash 的 cloneDeep 方法

const userStore = useUserStore();

const userInfo = ref({});
// 编辑表单
const editForm = ref({});
// 修改密码表单
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const getSelfInfo = async () => {
    const res = await userInfoService();
    console.log('前端接收的用户信息:', res);
    userInfo.value = res.data;
    editForm.value = cloneDeep(res.data);
    console.log("个人中心", userInfo.value);
};
getSelfInfo();

// 当前激活的 Tab
const activeTab = ref('info');

// 保存基本资料
const saveInfo = async () => {
    const res = await updateUserInfoService(editForm.value);
    const response = await userInfoService();
    console.log('前端接收的用户信息:', response.data);
    userStore.userInfo = response.data;
    userInfo.value = response.data;
    editForm.value = cloneDeep(response.data);
    ElMessage.success('基本资料已保存');
};

// 重置基本资料
const resetInfo = () => {
    editForm.value = cloneDeep(userInfo.value); // 使用深拷贝重置为 userInfo 的数据
    ElMessage.info('基本资料已重置');
};

// 修改密码
const updatePwd = async () => {
    let res = await updatePasswordService(passwordForm.value);
    ElMessage.success('密码修改成功，请重新登录');
    // 清空 token 和用户信息
    userStore.setToken(null);
    userStore.setUserInfo(null);
    // 跳转到登录页
    router.push('/login');
};

// 重置密码表单
const resetPassword = () => {
    passwordForm.value.oldPassword = '';
    passwordForm.value.newPassword = '';
    passwordForm.value.confirmPassword = '';
    ElMessage.info('密码表单已重置');
};
</script>
<template>
    <div class="personal-center">
        <el-row gutter="20">
            <!-- 左侧个人信息卡片 -->
            <el-col :span="8">
                <el-card class="info-card">
                    <div class="info-header">
                        <el-avatar :src="userInfo.avatar" size="large" />
                        <h3>{{ userInfo.nickname }}</h3>
                    </div>
                    <ul class="info-list">
                        <li><i class="el-icon-user"></i> 用户名称：{{ userInfo.nickname }}</li>
                        <li><i class="el-icon-phone"></i> 手机号码：{{ userInfo.phone }}</li>
                        <li><i class="el-icon-message"></i> 用户邮箱：{{ userInfo.email }}</li>
                        <li><i class="el-icon-s-custom"></i> 用户类型：
                            <template v-if="userInfo.userType === 0">系统管理员/程序员</template>
                            <template v-else-if="userInfo.userType === 1">教师</template>
                            <template v-else-if="userInfo.userType === 2">学生</template>
                            <template v-else>未知</template>
                        </li>
                        <li><i class="el-icon-identity"></i> 身份证号：{{ userInfo.identity }}</li>
                    </ul>
                </el-card>
            </el-col>

            <!-- 右侧基本资料和修改密码 -->
            <el-col :span="16">
                <el-card>
                    <el-tabs v-model="activeTab">
                        <!-- 基本资料 -->
                        <el-tab-pane label="基本资料" name="info">
                            <el-form :model="editForm" label-width="100px" class="edit-form">
                                <el-form-item label="用户昵称" required>
                                    <el-input v-model="editForm.nickname" placeholder="请输入用户昵称" />
                                </el-form-item>
                                <el-form-item label="手机号码" required>
                                    <el-input v-model="editForm.phone" placeholder="请输入手机号码" />
                                </el-form-item>
                                <el-form-item label="邮箱" required>
                                    <el-input v-model="editForm.email" placeholder="请输入邮箱" />
                                </el-form-item>
                                <el-form-item label="性别">
                                    <el-radio-group v-model="editForm.sex">
                                        <el-radio label="男" :value="'0'">男</el-radio>
                                        <el-radio label="女" :value="'1'">女</el-radio>
                                        <el-radio label="未知" :value="'2'">未知</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="saveInfo">保存</el-button>
                                    <el-button @click="resetInfo">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>

                        <!-- 修改密码 -->
                        <el-tab-pane label="修改密码" name="password">
                            <el-form :model="passwordForm" label-width="100px" class="edit-form">
                                <el-form-item label="旧密码" required>
                                    <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" />
                                </el-form-item>
                                <el-form-item label="新密码" required>
                                    <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
                                </el-form-item>
                                <el-form-item label="确认密码" required>
                                    <el-input v-model="passwordForm.confirmPassword" type="password"
                                        placeholder="请再次输入新密码" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="updatePwd">保存</el-button>
                                    <el-button @click="resetPassword">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>



<style scoped>
.personal-center {
    padding: 20px;
}

.info-card {
    text-align: center;
}

.info-header {
    margin-bottom: 20px;
}

.info-header h3 {
    margin-top: 10px;
}

.info-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.info-list li {
    margin: 10px 0;
    font-size: 14px;
    color: #606266;
    display: flex;
    align-items: center;
}

.info-list li i {
    margin-right: 10px;
    color: #409eff;
}

.edit-form {
    max-width: 500px;
    margin: 0 auto;
}
</style>