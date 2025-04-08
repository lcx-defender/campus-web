import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {},
    token: ''
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    getToken() {
      return this.token;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    getUserInfo() {
      return this.userInfo;
    }
  },
  persist: {
    enabled: true, // 启用持久化
    strategies: [
      {
        key: 'user', // 存储的键名
        storage: localStorage, // 使用 localStorage 存储
      },
    ],
  },
});