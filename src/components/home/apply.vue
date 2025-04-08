<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 表单数据
const form = ref({
    schoolName: '',
    legalPersonName: '',
    phone: '',
    email: '',
    legalPersonProof: null,
});

// 表单校验规则
const rules = {
    schoolName: [{ required: true, message: '请输入院校名称', trigger: 'blur' }],
    legalPersonName: [{ required: true, message: '请输入院校法人姓名', trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    legalPersonProof: [{ required: true, message: '请上传院校法人证明材料', trigger: 'change' }],
};

// 提交表单
const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            ElMessage.success('申请提交成功！我们会尽快与您联系。');
            // 提交逻辑（如发送到后端）
            console.log('提交数据:', form.value);
        } else {
            ElMessage.error('请完善表单信息后再提交！');
        }
    });
};

// 重置表单
const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<template>
    <div class="apply-page">
        <el-card class="form-card" shadow="hover">
            <h2 class="form-title">院校申请使用</h2>
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
                <!-- 院校名称 -->
                <el-form-item label="院校名称" prop="schoolName">
                    <el-input v-model="form.schoolName" placeholder="请输入院校名称" />
                </el-form-item>

                <!-- 院校法人姓名 -->
                <el-form-item label="院校法人姓名" prop="legalPersonName">
                    <el-input v-model="form.legalPersonName" placeholder="请输入院校法人姓名" />
                </el-form-item>

                <!-- 手机号 -->
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号" />
                </el-form-item>

                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>

                <!-- 院校法人证明材料 -->
                <el-form-item label="法人证明材料" prop="legalPersonProof">
                    <el-upload class="upload-demo" action="#" :on-change="(file) => (form.legalPersonProof = file)"
                        :file-list="form.legalPersonProof ? [form.legalPersonProof] : []" list-type="text">
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <div class="el-upload__tip">支持 jpg/png/pdf 格式文件</div>
                        </template>
                    </el-upload>
                </el-form-item>

                <!-- 操作按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm($refs.formRef)">提交申请</el-button>
                    <el-button @click="resetForm($refs.formRef)">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
.apply-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
    min-height: auto;
}

.form-card {
    width: 600px;
    padding: 20px;
}

.form-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
}

.form-container {
    margin-top: 20px;
}
</style>