<script setup>
import { useRouter } from 'vue-router';
import AboutSection from './about.vue'; // 引入关于我们组件

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

  <!-- 嵌入关于我们部分 -->
  <AboutSection />

  <div class="features">
    <h2>我们的特色服务</h2>
    <div class="features-list">
      <div class="feature-item">
        <img src="@/assets/images/home/index/apply-mock.jpg" alt="在线申请" />
        <h3>在线申请</h3>
        <p>便捷的在线申请系统，让您轻松完成入学手续。</p>
      </div>
      <div class="feature-item">
        <img src="@/assets/images/home/index/message-manage.jpg" alt="信息管理" />
        <h3>信息管理</h3>
        <p>完善的信息管理系统，高效处理学生数据。</p>
      </div>
      <div class="feature-item">
        <img src="@/assets/images/home/index/mobile.jpg" alt="移动服务" />
        <h3>移动服务</h3>
        <p>随时随地查看入学进度，获取校园资讯。</p>
      </div>
    </div>
  </div>

</template>

<style scoped>
.home-content {
  text-align: center;
  margin-top: 50px;
  background-image: url('@/assets/images/home/index/background.jpg'); /* 替换为实际图片路径 */
  background-size: cover;
  background-position: center;
  padding: 50px 20px; /* 添加内边距以避免内容贴边 */
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

.features {
  margin-top: 50px;
  text-align: center;
}

.features h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
}

.features-list {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.feature-item {
  width: 300px;
  text-align: center;
}

.feature-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.feature-item h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.feature-item p {
  font-size: 14px;
  color: #666;
}


.about-section {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  text-align: center; /* 居中对齐 */
  margin: 0 auto; /* 可选：确保水平居中 */
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

.about-section h3 {
  font-size: 20px;
  color: #4facfe;
  margin-top: 20px;
}

.about-section p {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
}

.about-section ul {
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 10px;
}

.about-section ul li {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.about-section ul li strong {
  color: #333;
}
</style>