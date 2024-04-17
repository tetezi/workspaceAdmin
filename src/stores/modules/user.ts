import { Login } from "@/api/sys/user";
import { getStorageName } from "@/utils/env";
import { defineStore } from "pinia";
import CryptoJS from "crypto-js";

type UserInfo = {
  userId: UUID;
  userNo: string;
  userName: string;
};
type State = {
  userInfo?: UserInfo;
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
    return { userInfo: undefined, token: undefined };
  },
  getters: {},
  actions: {
    async login({ userNo, password }: { userNo: string; password: string }) {
      const hashedPassword = CryptoJS.SHA256(password).toString(
        CryptoJS.enc.Hex
      );
      const { accessToken, user } = await Login({
        userNo,
        password: hashedPassword,
      });
      this.token = accessToken;
      this.userInfo = user;
    },
  },
});
