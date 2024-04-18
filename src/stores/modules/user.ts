import { Login } from "@/api/sys/user";
import { getStorageName } from "@/utils/env";
import { defineStore } from "pinia";
import CryptoJS from "crypto-js";

type UserInfo = {
  userId: UUID;
  userNo: string;
  name: string;
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
  },
  actions: {
    async login({ userNo, password }: { userNo: string; password: string }) {
      const hashedPassword = CryptoJS.SHA256(password).toString(
        CryptoJS.enc.Hex
      );
      const { accessToken, user } = await Login({
        userNo,
        password: password,
      });
      this.token = accessToken;
      this.user = user;
    },
    async afterLoginAction() {},
  },
});
