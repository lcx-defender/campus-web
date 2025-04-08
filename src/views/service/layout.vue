<script setup>
import { userInfoService } from '@/api/login.js';
import { useUserStore } from '@/store/user.js';

// 调用获取用户信息的接口
const userStore = useUserStore();
const getUserInfo = async () => {
    try {
        const response = await userInfoService();
        userStore.setUserInfo(response.data);
        console.log('用户信息:', response.data);
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};
getUserInfo();

</script>
<template>
    hello
</template>
<style scope></style>