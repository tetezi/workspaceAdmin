import { getStorageName } from "@/utils/env";
import { isUndefined } from "lodash";
import { defineStore } from "pinia";
export type Tab = {
  path: string;
  title: string;
  cache: boolean;
};
type TabState = {
  tabs: Array<Tab>;
};
export const useTabStore = defineStore({
  id: "tab", // 命名，唯一
  state: (): TabState => {
    return {
      tabs: [],
    };
  },
  persist: [
    {
      key: `${getStorageName()}_tab`,
      storage: localStorage,
    },
  ],
  getters: {
    // getTabPaths(): Array<string> {
    //   return this.tabs.map((i) => i.path);
    // },
    getCacheTabPaths(): Array<string> {
      return this.tabs.filter((tab) => tab.cache).map((i) => i.path);
    },
  },
  actions: {
    getTabIndexByPath(path: string): number {
      return this.tabs.findIndex((i) => i.path === path);
    },
    getTabByIndex(index: number): Tab {
      return this.tabs[index];
    },
    getTabByPath(path: string): Tab | undefined {
      return this.tabs.find((i) => i.path === path);
    },
    setTabs(tabs: Array<Tab>) {
      this.tabs = tabs;
    },
    clearTabs() {
      this.tabs = [];
    },
    setTab(tab: Tab, index?: number) {
      if (isUndefined(index)) {
        index =
          this.getTabIndexByPath(tab.path) !== -1
            ? this.getTabIndexByPath(tab.path)
            : this.tabs.length;
      }
      this.tabs.splice(index, 1, tab);
    },
    delTabByPath(path: string) {
      this.setTabs(this.tabs.filter((i) => i.path !== path));
    },
  },
});
