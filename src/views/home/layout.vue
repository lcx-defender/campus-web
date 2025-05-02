<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

// 动态获取当前路由的子路由
const menuItems = computed(() => {
  const currentRoute = router.options.routes.find(r => r.path === '/index');
  return currentRoute?.children || [];
});
</script>

<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <el-header class="navbar">
      <nav>
        <!-- 替换为可点击的图片 -->
        <router-link to="/home">
          <img src="@/assets/logo/header_logo.png" alt="智慧迎新平台" class="navbar-logo" />
        </router-link>
        <el-menu mode="horizontal" class="menu" router>
          <!-- <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/apply">申请使用</el-menu-item>
          <el-menu-item index="/schools">入驻学校</el-menu-item> -->
          <!-- 动态生成菜单项 -->
          <el-menu-item
            v-for="item in menuItems"
            :key="item.path"
            :index="item.path"
          >
            <router-link :to="item.path">{{ item.meta?.title || item.path }}</router-link>
          </el-menu-item>
          <!-- 管理端 -->
          <el-menu-item index="/service">
            <span>管理端</span>
          </el-menu-item>
          <!-- 学生移动端作为下载链接 -->
          <el-menu-item>
            <a href="https://greet-freshman.oss-cn-shanghai.aliyuncs.com/default-avatar.png" download
              style="color: white; text-decoration: none;">
              学生移动端下载链接
            </a>
          </el-menu-item>
          <el-menu-item index="/login">
            <span>登录</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>

    <!-- 底部版权信息 -->
    <el-footer class="footer">
      <p>© 2025 智慧迎新平台. 刘传星 版权所有.</p>
    </el-footer>
  </div>
</template>

<style scoped>
/* 按钮样式 */
.el-button {
  margin-left: auto;
  /* 将按钮推到最右侧 */
  white-space: nowrap;
  /* 防止按钮换行 */
  color: rgba(255, 255, 255, 0.9);
  /* 默认字体颜色，稍微降低透明度以提高对比度 */
  border: none;
  /* 移除边框 */
  background-color: rgba(255, 255, 255, 0.2);
  /* 半透明背景 */
  padding: 8px 16px;
  /* 调整内边距 */
  border-radius: 20px;
  /* 圆角按钮 */
  transition: background-color 0.3s, color 0.3s;
  /* 添加过渡效果 */
}

.el-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  /* 悬停时背景变为浅黑色，增强对比度 */
  color: #007bff;
  /* 悬停时字体颜色变为蓝色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* 添加阴影效果 */
}

.el-button:focus {
  outline: none;
  /* 移除点击时的默认边框 */
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  /* 固定在页面顶部 */
  top: 0;
  left: 0;
  width: 100%;
  /* 占满宽度 */
  z-index: 1000;
  /* 确保导航栏在其他内容之上 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  /* 渐变背景 */
  padding: 0 20px;
  height: 64px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
}

/* 导航栏图片样式 */
.navbar-logo {
  height: 40px;
  /* 设置图片高度 */
  margin-right: 20px;
  /* 与菜单保持间距 */
  cursor: pointer;
  /* 鼠标悬停时显示手型 */
}

/* 菜单项样式 */
.el-menu-item {
  color: rgba(255, 255, 255, 0.9);
  /* 提高字体对比度 */
  padding: 0 20px;
  font-weight: bold;
  transition: color 0.3s, background-color 0.3s;
  /* 添加过渡效果 */
}

.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  /* 悬停时背景变亮 */
  color: #ffeb3b;
  /* 悬停时文字颜色变为亮黄色 */
}

/* 链接样式 */
a {
  color: rgba(255, 255, 255, 0.9);
  /* 提高链接字体对比度 */
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #ffeb3b;
  /* 链接悬停时颜色变亮 */
}

.menu {
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  /* 从左到右排列 */
  background-color: transparent;
  color: white;
}

.navbar nav {
  display: flex;
  align-items: center;
  width: 100%;
}

.footer {
  text-align: center;
  padding: 10px 0;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
}

.home-page {
  padding-top: 64px;
  /* 为内容添加顶部间距，避免被固定导航栏遮挡 */
}
</style>