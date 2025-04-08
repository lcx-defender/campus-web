<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const navigateTo = (route) => {
  router.push({ path: `/${route}` });
};
</script>

<template>
  <div class="home-content">
    <h1>欢迎来到智慧迎新平台</h1>
    <p>
      智慧迎新平台致力于为学校和学生提供高效、便捷的迎新服务。通过我们的平台，您可以快速完成入学申请、查看学校信息以及获取最新的迎新动态。
    </p>
    <el-button type="primary" @click="navigateTo('apply')">立即申请使用</el-button>
  </div>
</template>

<style scoped>
.home-content {
  text-align: center;
  margin-top: 50px;
}

.home-content h1 {
  font-size: 32px;
  color: #333;
}

.home-content p {
  font-size: 16px;
  color: #666;
  margin: 20px 0;
}

.el-button {
  margin-top: 20px;
}
</style>