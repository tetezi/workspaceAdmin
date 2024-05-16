import { Login } from "@/api/sys/user";
import { getStorageName } from "@/utils/env";
import { defineStore } from "pinia";
import CryptoJS from "crypto-js";
import { useTabStore } from "./tabs";
import { useMenuStore } from "./menu";
import { PAGE } from "@/router/constant";
import { router } from "@/router";
import type { VNode } from "vue";
import defaultAvatar from "@/assets/images/defaultAvatar.jpg";
type UserInfo = {
  userId: UUID;
  userNo: string;
  name: string;

  avatarUrl: string;
};
type State = {
  user?: UserInfo;
  token?: string;
};
export const useUserStore = defineStore({
  id: "user", // 命名，唯一
  persist: [
    {
      key: `${getStorageName()}_user`,
      storage: localStorage,
    },
  ],
  state: (): State => {
    return { user: undefined, token: undefined };
  },
  getters: {
    getToken(state): string | undefined {
      return state.token;
    },
    getUserAvatar(state): (size: number) => VNode {
      return (size) => (
        <el-avatar
          src={state.user?.avatarUrl || defaultAvatar}
          size={size}
        >
          {state.user?.name}
        </el-avatar>
      );
    },
  },
  actions: {
    async login({ userNo, password }: { userNo: string; password: string }) {
      const hashedPassword = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
      const { accessToken, user } = await Login({
        userNo,
        password: hashedPassword,
      });
      this.token = accessToken;
      this.user = user;
    },
    async logout() {
      this.user = undefined;
      this.token = undefined;
      useTabStore().clearTabs();
      useMenuStore().clearMenuList();
      router.replace(PAGE.login);
    },
  },
});
