<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user.js';
import {useRouter} from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const codeUrl = ref("");
// 加载状态
const loading = ref(false);

// 登录表单数据
const loginForm = ref({
  username: "",
  password: "",
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

import { loginByUsername, getCodeImg } from "@/api/login.js";

// 获取登录验证码
const getCode = async () => {
  let res = await getCodeImg();
  codeUrl.value = "data:image/gif;base64," + res.data.img;
  loginForm.value.uuid = res.data.uuid;
}
getCode();

// 登录函数
const handleLogin = async () => {
  try {
    let result = await loginByUsername(loginForm.value);
    ElMessage.success(result.msg ? result.msg : '登录成功');
    userStore.setToken(result.data);
    // 登录成功后，跳转
    router.push({ path: "/service" });
  } catch (error) {
    // 登录失败时处理
    ElMessage.error(error.message || '登录失败');
    // 自动刷新验证码
    getCode();
  }
};
</script>

<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">智慧迎新平台</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width: 100%;">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%;"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <div class="el-login-footer">
      <span>© 2025 智慧迎新平台. 版权所有.</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>