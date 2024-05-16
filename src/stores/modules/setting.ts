import { getStorageName } from "@/utils/env";
import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

type State = {
  menu: {
    collapse: boolean;
    bgColor: string;
  };
};
export const useSettingStore = defineStore({
  id: "setting", // 命名，唯一
  persist: [
    {
      key: `${getStorageName()}_setting`,
      storage: localStorage,
    },
  ],
  state: (): State => {
    return {
      menu: {
        collapse: false,
        bgColor: "#292D3E",
      },
    };
  },
  getters: {},
  actions: {
    /**
     * 重置设置
     */
    resetting() {
      this.$reset();
    },
  },
});
