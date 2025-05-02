// user.js
import { defineStore } from 'pinia';
import { userInfoService } from '@/api/user.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null
  }),
  actions: {
    setToken(token) {
      this.token = token;
      console.log('Token set:', this.token);
    },
    getToken() {
      console.log('Token get:', this.token);
      return this.token;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      console.log('UserInfo set:', this.userInfo);
    },
    getUserInfo() {
      console.log('UserInfo get:', this.userInfo);
      return this.userInfo;
    },
    async fetchUserInfo() {
      try {
        const res = await userInfoService();
        this.setUserInfo(res.data);
        return res.data;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
      }
    }
  },
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token', 'userInfo']
  }
});