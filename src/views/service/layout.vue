<script setup>
import {
    Management,
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue';
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';

import { useUserStore } from '@/store/user.js';
import { usePermissionStore } from '@/store/permission.js';
import MenuItem from '@/components/MenuItem.vue';
const permissionStore = usePermissionStore();
const router = useRouter();
console.log('布局页面的router', router.getRoutes())
console.log('布局页面的sidebarRouters', permissionStore.sidebarRouters)
const menuItems = computed(() => {
    // 从 router 中获取所有路由
    const serviceRoute = router.getRoutes().find(route => route.path === '/service');
    // 如果找到 /service 路由，返回其子路由；否则返回空数组
    return serviceRoute?.children || [];
});
console.log('menuItems', menuItems.value)
const isCollapse = ref(false)
const handleOpen = function (key, keyPath) {
    console.log(key, keyPath);
};

const handleClose = function (key, keyPath) {
    console.log(key, keyPath);
};

import { logout } from '@/api/login.js';
import { userInfoService } from '@/api/system/user.js';
const userInfo = ref({});
const getUserInfo = async () => {
    // const res = await userInfoService();
    // useUserStore().setUserInfo(res.data); // 更新 store 中的用户信息
    // userInfo.value = res.data;
    userInfo.value = useUserStore().userInfo;
};
getUserInfo();

// 处理下拉菜单命令
const handleCommand = (command) => {
    if (command === 'info') {
        router.push('/user/selfInfo');
    } else if (command === 'logout') {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(async () => {
                try {
                    let res = await logout(); // 调用后端退出接口
                    ElMessage.success(res.message || '退出成功');
                } catch (error) {
                    ElMessage.error('退出失败，请稍后重试');
                }
                router.push('/'); // 跳转到首页
            })
            .catch(() => {
                ElMessage.info('已取消退出');
            });
    }
};

</script>
<template>
    <!-- 整体布局 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside :width="isCollapse ? '64px' : '200px'" class="menu-bar">
            <!-- 动态 logo -->
            <div class="el-aside__header">
                <div class="el-aside__logo" :class="{ collapsed: isCollapse }">
                    <template v-if="!isCollapse">智慧迎新平台</template>
                    <template v-else>迎</template>
                </div>
            </div>
            <!-- 菜单 -->
            <el-menu :default-active="router.path" :collapse="isCollapse" @open="handleOpen" @close="handleClose"
                active-text-color="#ffd04b" background-color="#2a3f54" text-color="#fff" router class="menu-content">
                <MenuItem v-for="item in menuItems" :key="item.path" :item="item" />
            </el-menu>
            <!-- 收缩/展开按钮 -->
            <div class="collapse-toggle" @click="isCollapse = !isCollapse">
                <el-icon>
                    <template v-if="isCollapse">
                        <SwitchButton />
                    </template>
                    <template v-else>
                        <SwitchButton />
                    </template>
                </el-icon>
            </div>
        </el-aside>

        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header class="header">
                <div class="header-left">
                    欢迎您，<strong>{{ userInfo.nickname }}</strong>
                </div>
                <div class="header-right">
                    <el-dropdown placement="bottom-end" @command="handleCommand">
                        <span class="el-dropdown__box">
                            <el-avatar :src="userInfo.avatar" />
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="info" :icon="User">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>智慧迎新平台 ©2025 Created by 星</el-footer>
        </el-container>
    </el-container>
</template>
<style scoped>
/* 整体布局 */
.layout-container {
    height: 100vh;
}
/* el-header 样式 */
.header {
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    align-items: center;
    padding: 0 20px;
    background-color: #fff;
    height: 64px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
    font-size: 16px;
    color: #333;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.el-dropdown__box {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.el-avatar {
    width: 32px;
    height: 32px;
    margin-right: 5px;
}

.el-icon {
    font-size: 16px;
    color: #333;
}

/* el-aside 样式 */
.menu-bar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #2a3f54; /* 统一背景颜色 */
    height: 100vh; /* 高度撑满父容器 */
    color: #fff;
    overflow: hidden;
    transition: width 0.3s ease; /* 平滑过渡 */
}

/* 顶部 logo 区域 */
.el-aside__header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    background-color: #2a3f54; /* 保持与菜单栏一致 */
    transition: all 0.3s ease;
}

.el-aside__logo {
    font-size: 20px;
    font-weight: bold;
    color: #ffd04b;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s ease;
}

.el-aside__logo.collapsed {
    font-size: 24px;
}

/* 菜单内容 */
.menu-content {
    flex: 1; /* 菜单内容占满剩余空间 */
    overflow-y: auto;
    background-color: #2a3f54; /* 保持与顶部一致 */
}

/* 菜单项样式 */
.el-menu-item {
    background-color: transparent;
    color: #fff;
    font-size: 16px;
    padding: 12px 20px;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 4px;
    margin: 5px 10px;
}

.el-menu-item:hover {
    background-color: #406182;
    color: #ffd04b;
}

.el-menu-item.is-active {
    background-color: #406182;
    color: #ffd04b;
}

.el-menu-item .el-icon {
    margin-right: 10px;
    font-size: 18px;
}

/* 收缩/展开按钮 */
.collapse-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    cursor: pointer;
    background-color: #2a3f54;
    color: #ffd04b;
    transition: all 0.3s ease;
}

.collapse-toggle:hover {
    background-color: #406182;
}
</style>