<script setup>
import {
    Management,
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
import { computed } from 'vue';
import { useUserStore } from '@/store/user.js';
import { logout, userInfoService } from '@/api/login.js';

const router = useRouter();
const userStore = useUserStore();
const userInfo = ref({});

// 动态获取当前路由的子路由
const menuItems = computed(() => {
    const currentRoute = router.options.routes.find(r => r.path === '/service');
    return currentRoute?.children || [];
});

const getUserInfo = async () => {
    try {
        const response = await userInfoService();
        userStore.setUserInfo(response.data);
        userInfo.value = response.data;
        console.log('调用过程用户信息:', response.data);
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};
getUserInfo();
console.log('布局界面用户信息:', userInfo.value);

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
                    await logout(); // 调用后端退出接口
                    userStore.setToken(''); // 清空 token
                    router.push('/login'); // 跳转到登录页
                    ElMessage.success('退出成功');
                } catch (error) {
                    ElMessage.error('退出失败，请稍后重试');
                }
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
        <el-aside width="200px" class="menu-bar">
            <div class="el-aside__logo">智慧迎新平台</div>
            <el-menu 
                active-text-color="#ffd04b" 
                background-color="#2a3f54" 
                text-color="#fff" 
                router
            >
                <!-- 动态生成菜单项 -->
                <el-menu-item 
                    v-for="item in menuItems" 
                    :key="item.path" 
                    :index="item.path"
                >
                    <el-icon v-if="item.meta?.icon">
                        <component :is="item.meta.icon" />
                    </el-icon>
                    <span>{{ item.meta?.title || item.path }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header class="header">
                <div>欢迎您，<strong>{{ userInfo.nickname }}</strong></div>
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
.layout-container {
    height: 100vh;
}

.menu-bar {
    background-color: #2a3f54;
    color: #fff;
    width: 240px;
    padding-top: 20px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    height: 100vh;
    overflow-y: auto;
}

.el-aside__logo {
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #ffd04b;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #fff;
    border-bottom: 1px solid #eaeaea;
}

.el-dropdown__box {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.el-avatar {
    margin-right: 8px;
}

.el-menu-item {
    background-color: #2a3f54; /* 默认深蓝色背景 */
    color: #fff; /* 默认文字颜色 */
    font-size: 16px;
    padding: 12px 20px;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 4px;
    margin: 5px 10px;
}

.el-menu-item:hover {
    background-color: #406182; /* 比未选中颜色稍深，但比选中颜色浅 */
    color: #ffd04b; /* 悬停时文字颜色为亮黄色 */
}

.el-menu-item.is-active {
    background-color: #406182; /* 比未选中颜色稍深的蓝色 */
    color: #ffd04b; /* 选中时文字颜色为亮黄色 */
}

.el-menu-item .el-icon {
    margin-right: 10px;
    font-size: 18px;
}
</style>