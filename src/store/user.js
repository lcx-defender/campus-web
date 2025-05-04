// user.js
import { defineStore } from 'pinia';
import { userInfoService } from '@/api/user.js';
import { getToken } from '@/utils/token.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: getToken()
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      console.log('UserInfo set:', this.userInfo);
    },
    getUserInfo() {
      console.log('UserInfo get:', this.userInfo);
      return this.userInfo;
    }
  },
  // persist: {
  //   key: 'user-store',
  //   storage: localStorage,
  //   paths: ['token', 'userInfo']
  // }
});