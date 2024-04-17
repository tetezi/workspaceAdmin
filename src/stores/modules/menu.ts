import { getStorageName } from "@/utils/env";
import { defineStore } from "pinia";

export const useMenuStore = defineStore({
  id: "menu", // 命名，唯一
  persist: [
    {
      key: `${getStorageName()}_menu`,
      storage: sessionStorage,
    },
  ],
  state: () => {
    return {};
  },
  getters: {},
  actions: {},
});
